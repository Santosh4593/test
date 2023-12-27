from fastapi import FastAPI, File, UploadFile
import os
import aiofiles
from fastapi.responses import StreamingResponse, FileResponse
from endpoint_vehicle import count
from conversion import csv_to_json


app = FastAPI()



@app.post("/upload-video/")
async def upload_video(video: UploadFile = File(...)):

    try:
        # Specify the directory where you want to save the video
        upload_dir = "upload-video"
        
        # Ensure the directory exists, create if not
        os.makedirs(upload_dir, exist_ok=True)

        # Join the directory and file name using os.path
        video_path = os.path.join(upload_dir, video.filename)

        # Use async reading and writing
        async with aiofiles.open(video_path, "wb") as video_file:
            content = await video.read()
            await video_file.write(content)
            await count(video_path)
        csv_content = open("data.csv").read()
        json_data = csv_to_json(csv_content)

        return { "Data ": json_data}

     

    except Exception as e:
        # Handle exceptions (e.g., file-related errors)
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/show")
async def video():
    some_file_path = "processed_videos/annotated_video.mp4"
    return FileResponse(some_file_path)

@app.get("/")
def root():
    return {"Hello World"}
