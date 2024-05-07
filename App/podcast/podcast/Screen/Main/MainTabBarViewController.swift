//
//      .swift
//  podcast
//
//  Created by HieuNT on 02/05/2024.
//

import UIKit

class MainTabBarViewController: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }
    
    func setupView() {
        viewControllers = TabBarItem.allCases.map({ tab in
            let controller = tab.controller
            controller.tabBarItem = UITabBarItem(title: tab.title, image: tab.icon, tag: tab.rawValue)
            return controller
        })
        tabBar.backgroundColor = .white
    }
}
