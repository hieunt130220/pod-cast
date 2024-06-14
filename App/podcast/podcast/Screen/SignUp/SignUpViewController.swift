//
//  SignUpViewController.swift
//  podcast
//
//  Created by HieuNT on 02/05/2024.
//

import UIKit

class SignUpViewController: UIViewController {

    @IBOutlet weak var passwordTf: UITextField!
    @IBOutlet weak var emailTf: UITextField!
    @IBOutlet weak var userNameTf: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Sign up"
        // Do any additional setup after loading the view.
    }
    @IBAction func tapRegister(_ sender: Any) {
        if userNameTf.text?.isEmpty == true {
            showMessage("Please enter user name")
            return
        }
        
        if !userNameTf.text!.isValid(.username) {
            showMessage("Password contain 3-16 alphabet character and numberic")
            return
        }
        
        if emailTf.text?.isEmpty == true {
            showMessage("Please enter email")
            return
        }
        
        if !emailTf.text!.isValid(.email) {
            showMessage("This is not valid email format")
            return
        }
        
        if passwordTf.text?.isEmpty == true {
            showMessage("Please enter password")
            return
        }
        
        if !passwordTf.text!.isValid(.password) {
            showMessage("Password contain 8-16 alphabet character and numberic")
            return
        }
        
        view.activityIndicatorView.startAnimating()
        AppRepository.auth.register(params: .init(username: userNameTf.text!, email: emailTf.text!, password: passwordTf.text!)) { token in
            self.view.activityIndicatorView.stopAnimating()
            self.showMessage("Register success") {
                Constants.sceneDelegate?.appNavigator?.switchToAuth()
            }
        } failure: { error, statusCode in
            if statusCode == StatusCode.badRequest.rawValue {
                self.showMessage("Account already exists")
            }
            self.view.activityIndicatorView.stopAnimating()
        }
    }
    
}
