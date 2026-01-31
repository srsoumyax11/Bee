package hub

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	Hub    *Hub
	Conn   *websocket.Conn
	Send   chan []byte
	Name   string
	Device string
	IP     string
}

type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
			log.Printf("Client connected: %s", client.Conn.RemoteAddr())
			h.broadcastUsers()
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
				log.Printf("Client disconnected")
				h.broadcastUsers()
			}
		case message := <-h.Broadcast:
			h.sendToAll(message)
		}
	}
}

func (h *Hub) broadcastUsers() {
	type User struct {
		Name   string `json:"name"`
		Device string `json:"device"`
		IP     string `json:"ip"`
	}
	users := []User{}
	for client := range h.Clients {
		name := client.Name
		if name == "" {
			name = "Anonymous"
		}
		users = append(users, User{Name: name, Device: client.Device, IP: client.IP})
	}

	msg, _ := json.Marshal(map[string]interface{}{
		"type": "users",
		"data": users,
	})
	h.sendToAll(msg)
}

func (h *Hub) sendToAll(message []byte) {
	for client := range h.Clients {
		select {
		case client.Send <- message:
		default:
			close(client.Send)
			delete(h.Clients, client)
		}
	}
}
