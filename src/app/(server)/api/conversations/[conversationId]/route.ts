import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      console.error("Invalid current user:", currentUser);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      console.error("Conversation not found for ID:", conversationId);
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      try {
        if (user.email) {
          pusherServer.trigger(
            user.email,
            "conversation:remove",
            existingConversation,
          );
        }
      } catch (pusherError: any) {
        console.error("Error triggering conversation:remove event:", pusherError);

        // Log the Pusher error message (adjust the property based on your Pusher library version)
        const errorMessage = (pusherError as { data?: { message?: string } })?.data?.message || pusherError.message;
        console.error("Pusher Error Message:", errorMessage);

        // Handle the error accordingly
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
