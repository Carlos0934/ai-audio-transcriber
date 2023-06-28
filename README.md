# AI Audio Transcriber

AI Audio Transcriber is a project that utilizes Deno as an API and Astro for the frontend. It enables the transcription of audio to text using the OpenAI API. The project incorporates custom implementations of a task queue for audio processing based on events and an in-memory cache with a limited lifespan that utilizes the hash of audio files.

![image](https://github.com/Carlos0934/ai-audio-transcriber/assets/46497770/80b3544a-bb6f-4919-aa31-70a905a1ffdf)

## Setup

To set up the project, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/Carlos0934/ai-audio-transcriber.git
   ```

2. Navigate to the project directory:

   ```
   cd ai-audio-transcriber
   ```

3. Run Docker Compose to start the required services:

   ```
   docker-compose up
   ```

4. Create a new file called `.env` in the project's root directory.

5. In the `.env` file, configure the `OPENAI_API_KEY` variable with your OpenAI API key:

   ```
   OPENAI_API_KEY=your-openai-api-key
   ```

   Replace `your-openai-api-key` with your actual OpenAI API key.

6. Save the `.env` file.

7. The web app will be accessible on port 3000. Open your browser and navigate to `http://localhost:3000`.

## Task Queue Implementation

The project incorporates a task queue to handle audio processing based on events. This implementation ensures efficient and scalable processing of audio files. When an audio file is uploaded, it is added to the task queue, and the transcription process is initiated asynchronously. The task queue manages the order of processing and prevents overloading the system by limiting the number of concurrent tasks.

## In-Memory Cache

The project also utilizes an in-memory cache with a limited lifespan. The cache is used to store the results of previous transcriptions, allowing for faster retrieval when the same audio file needs to be transcribed again. The cache uses the hash of the audio files as keys for efficient lookup and retrieval.

The cache has a time-to-live (TTL) mechanism, which means that cached entries are automatically removed after a certain period of time to ensure the freshness of the transcriptions. This helps improve performance and reduces the reliance on external resources for repeated transcriptions.

Please refer to the project's source code for detailed implementation details of the task queue and cache.

## License

This project is licensed under the MIT License. Please see the [LICENSE](LICENSE) file for more details.

