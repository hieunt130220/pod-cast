//
//  LoginViewController.swift
//  podcast
//
//  Created by HieuNT on 02/05/2024.
//

import UIKit
import BonMot
class LoginViewController: UIViewController {

    @IBOutlet weak var signUpBtn: UIButton!
    @IBOutlet weak var emailTf: UITextField!
    @IBOutlet weak var passwordTf: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Login"
        let accountText = "Not have account?".styled(with: .color(.black), .font(.systemFont(ofSize: 15, weight: .regular)))
        let signUpText = "Sign up".styled(with: .color(.systemTeal), .font(.systemFont(ofSize: 15, weight: .bold)))
        signUpBtn.setAttributedTitle(.composed(of: [accountText, signUpText], separator: " "), for: .normal)
        emailTf.text = "nth2@gmail.com"
        passwordTf.text = "12312311123"
    }
    @IBAction func tapLogin(_ sender: Any) {
        if emailTf.text?.isEmpty == true {
            showMessage("Please enter email")
            return
        }
        
        if !emailTf.text!.isValid(.email) {
            showMessage("Email invalid")
            return
        }
        
        if passwordTf.text?.isEmpty == true {
            showMessage("Please enter password")
            return
        }
        
        if !passwordTf.text!.isValid(.password) {
            showMessage("Password only contain 8-16 alphabet character and numberic")
            return
        }
        
        view.activityIndicatorView.startAnimating()
        AppRepository.auth.login(params: .init(email: emailTf.text!, password: passwordTf.text!)) { token in
            self.view.activityIndicatorView.stopAnimating()
            LocalData.shared.token = token
            Constants.sceneDelegate?.appNavigator?.switchToMain()
        } failure: { error, statusCode in
            if statusCode == StatusCode.unauthorized.rawValue {
                self.showMessage("Email or password is not correct")
            }
            self.view.activityIndicatorView.stopAnimating()
        }

    }
    @IBAction func tapSignUp(_ sender: Any) {
        let signUpVc = SignUpViewController()
        navigationController?.pushViewController(signUpVc, animated: true)
    }
}
