//
//  ViewController.swift
//  podcast
//
//  Created by HieuNT on 15/04/2024.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        let btn = UIButton()
        btn.backgroundColor = .red
        view.addSubview(btn)
        
        btn.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            btn.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            btn.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            btn.widthAnchor.constraint(equalToConstant: 100),
            btn.heightAnchor.constraint(equalToConstant: 50)
        ])
        
        btn.addTarget(self, action: #selector(tap), for: .touchUpInside)
    }
    @objc func tap() {
       
    }

}

