import { io } from "../http";
import { ConnectionService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
  const connectionsService = new ConnectionService();
  const messagesService = new MessagesService();

  const allConnectionsWhitoutAdmin = await connectionsService.findAllWhithoutAdmin();

  io.emit("admin_list_all_users", allConnectionsWhitoutAdmin);

  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messagesService.listByUser(user_id);

    callback(allMessages);
  });

  socket.on("admin_send_message", async (params) => {
    const { user_id, texte } = params;

    await messagesService.create({
      texte,
      user_id,
      admin_id: socket.id,
    });

    const { socket_id } = await connectionsService.findUserById(user_id);

    io.to(socket_id).emit("admin_send_to_client", {
      texte,
      socket_id: socket_id,
    });
  });

  socket.on("admin_user_in_support", async (params) => {
    const { user_id } = params;
    await connectionsService.updateAdminID(user_id, socket.id);

    const allConnectionsWhitoutAdmin = await connectionsService.findAllWhithoutAdmin();

    io.emit("admin_list_all_users", allConnectionsWhitoutAdmin);
  });
});