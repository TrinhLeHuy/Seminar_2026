import { Audio } from "expo-av";

let sound: any = null;

export const playAudio = async (url: string) => {
  try {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );

    sound = newSound;

    newSound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish) {
        sound = null;
      }
    });

  } catch (err) {
    console.log("PLAY AUDIO ERROR", err);
  }
};

export const stopAudio = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
};