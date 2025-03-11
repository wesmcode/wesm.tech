"use client"

class SoundManager {
  private static instance: SoundManager
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled = false

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  public loadSound(name: string, url: string, volume = 1.0): void {
    if (typeof window === "undefined") return

    const audio = new Audio(url)
    audio.volume = volume
    this.sounds.set(name, audio)
  }

  public playSound(name: string): void {
    if (!this.enabled) return

    const sound = this.sounds.get(name)
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement
      clone.volume = sound.volume
      clone.play().catch((e) => console.error(`Error playing sound ${name}:`, e))
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public preloadSounds(): void {
    if (typeof window === "undefined") return

    // Preload common sounds
    this.loadSound("typing", "/typing.mp3", 0.1)
    this.loadSound("delete", "/delete.mp3", 0.15)
    this.loadSound("error", "/error.mp3", 0.2)
    this.loadSound("success", "/success.mp3", 0.2)
  }
}

export default SoundManager.getInstance()

