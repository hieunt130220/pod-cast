//
//  UIViewController+ext.swift
//  podcast
//
//  Created by HieuNT on 02/05/2024.
//

import UIKit
import Toast_Swift
extension UIViewController {
    func showMessage(_ msg: String) {
        view.makeToast(msg, duration: 2)
    }
}
