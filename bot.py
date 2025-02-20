import os
import cv2
import numpy as np
from slack_sdk import WebClient
from slack_sdk.socket_mode import SocketModeClient
from slack_sdk.socket_mode.response import SocketModeResponse
from slack_sdk.socket_mode.request import SocketModeRequest
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Slack clients
app_token = os.environ["SLACK_APP_TOKEN"]
bot_token = os.environ["SLACK_BOT_TOKEN"]
web_client = WebClient(token=bot_token)
client = SocketModeClient(app_token=app_token, web_client=web_client)

from digit_recognition import recognize_digit

def process_image(image_url):
    """
    Process the image from Slack and recognize handwritten digits
    """
    return recognize_digit(image_url)

def handle_message(client: SocketModeClient, req: SocketModeRequest):
    if req.type == "events_api":
        # Acknowledge the request
        client.send_socket_mode_response(SocketModeResponse(envelope_id=req.envelope_id))
        
        event = req.payload["event"]
        
        # Handle only messages with files
        if event["type"] == "message" and "files" in event:
            channel_id = event["channel"]
            for file in event["files"]:
                if file["mimetype"].startswith("image/"):
                    # Process the image and get the result
                    result = process_image(file["url_private"])
                    
                    # Send the response back to Slack
                    web_client.chat_postMessage(
                        channel=channel_id,
                        text=f"识别结果: {result}" if result else "无法识别数字"
                    )

def main():
    # Add handler
    client.socket_mode_request_listeners.append(handle_message)
    # Start the client
    client.connect()
    print("Bot is running!")
    
    # Keep the bot running
    import time
    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()
