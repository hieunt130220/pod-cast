//
//  PodCastViewController.swift
//  podcast
//
//  Created by HieuNT on 20/05/2024.
//

import UIKit
import Kingfisher
import AVKit
import MediaPlayer

class PodCastViewController: UIViewController {
    
    @IBOutlet weak var backwardBtn: UIButton!
    @IBOutlet weak var forwardBtn: UIButton!
    @IBOutlet weak var playBtn: UIButton!
    @IBOutlet weak var volumeSlider: UISlider!
    @IBOutlet weak var timeSlider: UISlider!
    @IBOutlet weak var userBtn: UIButton!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var endTimeLbl: UILabel!
    @IBOutlet weak var startTimeLbl: UILabel!
    @IBOutlet weak var thumbnailImage: UIImageView!
    
    var podCast: PodCast!
    
    private let player: AVPlayer = {
        let avPlayer = AVPlayer()
        avPlayer.automaticallyWaitsToMinimizeStalling = false
        return avPlayer
    }()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        setupRemoteControl()
        setupInterruptionObserver()
        
        observePlayerCurrentTime()
        observeBoundaryTime()
        
        setupNowPlayingInfo()
        setupAudioSession()
        playEpisode()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        player.pause()
    }
    
    private func setupUI() {
        titleLabel.text = podCast.caption
        userBtn.setTitle(podCast.user.username, for: .normal)
        thumbnailImage.kf.setImage(with: URL(string: podCast.background))
        startTimeLbl.text = "00:00:00"
        endTimeLbl.text = "--:--:--"
        volumeSlider.value = AVAudioSession.sharedInstance().outputVolume
    }
    
    @IBAction func tapUser(_ sender: Any) {
        let vc = OtherUserViewController()
        vc.user = podCast.user
        print(podCast.user.id)
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @IBAction func tapPlay(_ sender: Any) {
        playPause()
    }
    
    @IBAction func tapForward(_ sender: Any) {
        seekToCurrentTime(delta: 15)
    }
    
    @IBAction func tapBackward(_ sender: Any) {
        seekToCurrentTime(delta: -15)
    }
    
    @IBAction func changeTimeSlider(_ sender: UISlider) {
        let percentage = timeSlider.value
        guard let duration = player.currentItem?.duration else { return }
        let durationInSeconds = CMTimeGetSeconds(duration)
        let seekTimeInSeconds = Float64(percentage) * durationInSeconds
        let seekTime = CMTimeMakeWithSeconds(seekTimeInSeconds, preferredTimescale: 1)
        
        MPNowPlayingInfoCenter.default().nowPlayingInfo?[MPNowPlayingInfoPropertyElapsedPlaybackTime] = seekTimeInSeconds
        player.seek(to: seekTime)
    }
    
    @IBAction func changeVolumeSlider(_ sender: UISlider) {
        player.volume = sender.value
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self, name: AVAudioSession.interruptionNotification, object: nil)
    }
}

extension PodCastViewController {
    func playPause() {
        if player.timeControlStatus == .paused {
            player.play()
            playBtn.setImage(UIImage(systemName: "pause.fill"), for: .normal)
            setupElapsedTime(playbackRate: 1)
        } else {
            player.pause()
            playBtn.setImage(UIImage(systemName: "play.fill"), for: .normal)
            setupElapsedTime(playbackRate: 0)
        }
    }
    
    private func seekToCurrentTime(delta: Int64) {
        let seconds = CMTimeMake(value: delta, timescale: 1)
        let seekTime = CMTimeAdd(player.currentTime(), seconds)
        player.seek(to: seekTime)
    }
    
    private func setupElapsedTime(playbackRate: Float) {
        let elapsedTime = CMTimeGetSeconds(player.currentTime())
        MPNowPlayingInfoCenter.default().nowPlayingInfo?[MPNowPlayingInfoPropertyElapsedPlaybackTime] = elapsedTime
        MPNowPlayingInfoCenter.default().nowPlayingInfo?[MPNowPlayingInfoPropertyPlaybackRate] = playbackRate
    }
    
    private func setupNowPlayingInfo() {
        var nowPlayingInfo = [String: Any]()
        nowPlayingInfo[MPMediaItemPropertyTitle] = podCast.caption
        nowPlayingInfo[MPMediaItemPropertyArtist] = podCast.user.username
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
    
    private func setupAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch let sessionError {
            print("Failed to activate session:", sessionError)
        }
    }
    
    private func playEpisode() {
        playEpisodeUsingFileUrl()
    }
    
    private func playEpisodeUsingFileUrl() {
        print("Attempt to play episode with file url:", podCast.audio)
        
        guard let fileUrl = URL(string: podCast.audio) else { return }

        let playerItem = AVPlayerItem(url: fileUrl)
        player.replaceCurrentItem(with: playerItem)
        player.play()
        playBtn.setImage(UIImage(systemName: "pause.fill"), for: .normal)
    }
    
    private func observePlayerCurrentTime() {
        let interval = CMTimeMake(value: 1, timescale: 2)
        player.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            self?.startTimeLbl.text = time.toDisplayString()
            let durationTime = self?.player.currentItem?.duration
            self?.endTimeLbl.text = durationTime?.toDisplayString()
            
            self?.updateCurrentTimeSlider()
        }
    }
    
    private func observeBoundaryTime() {
        let time = CMTimeMake(value: 1, timescale: 3)
        let times = [NSValue(time: time)]
        
        player.addBoundaryTimeObserver(forTimes: times, queue: .main) { [weak self] in
            print("Episode started playing")
            self?.setupLockscreenDuration()
        }
    }
    
    private func updateCurrentTimeSlider() {
        let currentTimeSeconds = CMTimeGetSeconds(player.currentTime())
        let durationSeconds = CMTimeGetSeconds(player.currentItem?.duration ?? CMTimeMake(value: 1, timescale: 1))
        let percentage = currentTimeSeconds / durationSeconds
        
        timeSlider.value = Float(percentage)
    }
}

extension PodCastViewController {
    private func setupRemoteControl() {
        UIApplication.shared.beginReceivingRemoteControlEvents()
        
        let commandCenter = MPRemoteCommandCenter.shared()
        commandCenter.playCommand.isEnabled = true
        commandCenter.playCommand.addTarget { _ -> MPRemoteCommandHandlerStatus in
            self.player.play()
            self.setupElapsedTime(playbackRate: 1)
            return .success
        }
        
        commandCenter.pauseCommand.isEnabled = true
        commandCenter.pauseCommand.addTarget { _ -> MPRemoteCommandHandlerStatus in
            self.player.pause()
            self.setupElapsedTime(playbackRate: 0)
            return .success
        }
        
        commandCenter.togglePlayPauseCommand.isEnabled = true
        commandCenter.togglePlayPauseCommand.addTarget { _ -> MPRemoteCommandHandlerStatus in
            self.playPause()
            return .success
        }
    }
    
    private func setupInterruptionObserver() {
        NotificationCenter.default.addObserver(self, selector: #selector(handleInterruption), name: AVAudioSession.interruptionNotification, object: nil)
    }
    
    @objc
    private func handleInterruption(notification: Notification) {
        guard let userInfo = notification.userInfo else { return }
        guard let type = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt else { return }
        
        if type == AVAudioSession.InterruptionType.began.rawValue {
            print("Interruption began")
        } else {
            print("Interruption ended")
            guard let options = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt else { return }
            if options == AVAudioSession.InterruptionOptions.shouldResume.rawValue {
                player.play()
            }
        }
    }
    
    private func setupLockscreenDuration() {
        guard let duration = player.currentItem?.duration else { return }
        let durationSeconds = CMTimeGetSeconds(duration)
        MPNowPlayingInfoCenter.default().nowPlayingInfo?[MPMediaItemPropertyPlaybackDuration] = durationSeconds
    }
    
}
