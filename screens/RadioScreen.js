import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [songInfo, setSongInfo] = useState({ title: '', artist: '', listeners: 0, art: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudio();

    const intervalId = setInterval(() => {
      obtenerDatos();
    }, 10000);

    return () => {
      if (audio) {
        audio.unloadAsync();
      }
      clearInterval(intervalId);
    };
  }, []);

  const loadAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://streamer.micapa.net/listen/radio_micapa/radio.mp3' },
      { shouldPlay: false }
    );
    setAudio(sound);
  };

  const playAudio = async () => {
    if (audio) {
      if (isPlaying) {
        await audio.pauseAsync();
      } else {
        await audio.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleAudioMuted = async () => {
    if (audio) {
      await audio.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const obtenerDatos = async () => {
    try {
      const response = await fetch('https://streamer.micapa.net/api/nowplaying');
      const data = await response.json();
      if (data && data.length > 0) {
        const cancion = data[0];
        setSongInfo({
          title: cancion.now_playing.song.title,
          artist: cancion.now_playing.song.artist,
          listeners: cancion.listeners.unique,
          art: cancion.now_playing.song.art,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Radio</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.songTitle}>{songInfo.title}</Text>
          <Text style={styles.songArtist}>{songInfo.artist}</Text>
          <Image source={{ uri: songInfo.art }} style={styles.artImage} />
          <Text style={styles.listeners}>Oyentes: {songInfo.listeners}</Text>
        </View>
      )}
      <View style={styles.controls}>
        <TouchableOpacity onPress={playAudio} style={styles.button}>
          <Text>{isPlaying ? 'Pausa' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleAudioMuted} style={styles.button}>
          <Text>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => obtenerDatos()} style={styles.button}>
          <Text>Recargar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  songArtist: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  artImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  listeners: {
    fontSize: 16,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '80%',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
});
