//
//  SettingViewController.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 22/5/24.
//

import UIKit

class SettingViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        title = "Setting"
    }

    @IBAction func tapChangePassword(_ sender: Any) {
        let alert = UIAlertController(title: "Change Password", message: "", preferredStyle: .alert)
        alert.addTextField { tf in
            tf.placeholder = "Old password"
        }
        alert.addTextField { tf in
            tf.placeholder = "New password"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { action in
            guard let old = alert.textFields![0].text, let new = alert.textFields![1].text, !old.isEmpty, !new.isValid(.password) else {
                return
            }
            self.view.activityIndicatorView.startAnimating()
            AppRepository.auth.changePassword(params: .init(oldPassword: alert.textFields![0].text ?? "",
                                                            newPassword: alert.textFields![1].text ?? "")) { success in
                self.showMessage("Change password successful!")
                self.view.activityIndicatorView.stopAnimating()
            } failure: { error, statusCode in
                self.showMessage("Old password incorrect")
                self.view.activityIndicatorView.stopAnimating()
            }

        }))
        present(alert, animated: true)
    }
    
    @IBAction func tapLogout(_ sender: Any) {
        LocalData.shared.withdrawn()
        Constants.sceneDelegate?.appNavigator?.switchToAuth()
    }
}
