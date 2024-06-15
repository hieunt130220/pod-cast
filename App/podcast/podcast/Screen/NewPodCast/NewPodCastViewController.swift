//
//  NewPodCastViewController.swift
//  podcast
//
//  Created by HieuNT on 21/05/2024.
//

import UIKit
import MobileCoreServices

class NewPodCastViewController: UIViewController {
    
    @IBOutlet weak var chooseFileBtn: UIButton!
    @IBOutlet weak var thumbnailImage: UIImageView!
    @IBOutlet weak var captionTf: UITextField!
    
    var podcastUrl: URL?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "New Pod cast"
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Post", style: .done, target: self, action: #selector(post))
        thumbnailImage.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(selectImage)))
        captionTf.delegate = self
    }
    
    @objc private func selectImage() {
        let picker = UIImagePickerController()
        picker.sourceType = .photoLibrary
        picker.delegate = self
        picker.allowsEditing = true
        present(picker, animated: true)
    }
    
    @objc private func post() {
        guard let imageData = thumbnailImage.image?.jpegData(compressionQuality: 1),
              let podcastUrl = podcastUrl,
              let podCastData = try? Data(contentsOf: podcastUrl),
              let caption = captionTf.text else { return }
        
        view.activityIndicatorView.startAnimating()
        AppRepository.podCast.createNew(caption: caption,
                                        background: imageData,
                                        audio: podCastData, completion: {[weak self] postCast in
            self?.view.activityIndicatorView.stopAnimating()
            self?.navigationController?.popViewController(animated: true)
        }, failure: {[weak self] error, statusCode in
            self?.showMessage("Error while uploading file")
            self?.view.activityIndicatorView.stopAnimating()
        })
    }
    
    @IBAction func tapChooseFile(_ sender: Any) {
        let pickerController = UIDocumentPickerViewController(forOpeningContentTypes: [.audio], asCopy: true)
        pickerController.delegate = self
        pickerController.modalPresentationStyle = .fullScreen
        pickerController.allowsMultipleSelection = false
        present(pickerController, animated: true)
    }
}

extension NewPodCastViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: true)
        guard let image = info[.editedImage] as? UIImage else { return }
        thumbnailImage.image = image
    }
}

extension NewPodCastViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let url = urls.first else { return }
        podcastUrl = url
        chooseFileBtn.setTitle(url.lastPathComponent, for: .normal)
        controller.dismiss(animated: true)
    }
}

extension NewPodCastViewController: UITextFieldDelegate {
    
}
