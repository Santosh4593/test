from fastapi import FastAPI, File, UploadFile
import os
import aiofiles


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

        return {"message": "Video saved successfully"}

    except Exception as e:
        # Handle exceptions (e.g., file-related errors)
        return {"error": f"An error occurred: {str(e)}"}


@app.get("/")
def root():
    return {"Hello World"}
