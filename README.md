# zche0245_9103_MajorProject
## **Instructions**
- Before watching the work, make sure your device is not muted.
- When you open and run this file, a dark background with the title "click to play" will appear in the center of the screen.
- Click the left mouse button, and the project will start playing automatically. Click again to pause.
The flowing lines will change with the music: when the treble is strong, the lines will become longer; when the bass is strong, the lines will become thicker. Additionally, the overall volume will affect the visuals, making the background brighter or flickering as the volume changes, and the number of flowing lines will also vary with the volume.
## **Details of Individual Approach**
My personal project is using audio to make animations. I mainly change properties such as the length, stroke weight, number of flowing lines, as well as the background grayscale. These values are related to certain audio values, including overall volume and some specific frequency energy values.
## **Inspiration**
My design inspiration comes from my computer wallpaper, which features music visualization. When music plays, this wallpaper displays a circular visualizer. It also changes color and vibrates with the bass. Therefore, I incorporated variables related to different frequency energy values in my project to create more interesting and varied changes.
Additionally, because we are creating post-impressionist works, Van Gogh's "Starry Night" interactive app also inspired me. In my project, all flowing lines are carefully designed to replicate the direction of the artist's brush strokes.
## **Technical Explanation**
### Retrieving Audio Information
My design is based on group code files, incorporating audio and an analyzer. I used Fast Fourier Transform (FFT) to get the energy values in the high and low-frequency regions of the audio spectrum and used Amplitude to get the loudness value of the audio.
### Defining Line Properties
In the initial team file, most line properties were predefined. I made many changes here by introducing global variables for line thickness, length, drawing grayscale, and the number of iterations in the drawing loop. It helps me to bring in Audio values to those values easily.
### Mouse Click to Play
Added a mouse click function to control music playback and the display or disappearance of the playback prompt. My technical approach to audio analysis refers to the Week 11 tutorial.
