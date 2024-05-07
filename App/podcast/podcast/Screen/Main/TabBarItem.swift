//
//  TabBarItem.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import UIKit

enum TabBarItem: Int, CaseIterable {
    case home
    case search
    case profile
    
    var title: String {
        switch self {
        case .home:
            return "Feed"
        case .search:
            return "Search"
        case .profile:
            return "My Page"
        }
    }
    
    var icon: UIImage {
        switch self {
        case .home:
            return UIImage.icTabHome
        case .search:
            return UIImage.icTabSearch
        case .profile:
            return UIImage.icTabProfile
        }
    }
    
    var controller: UIViewController {
        switch self {
        case .home:
            return UIViewController()
        case .search:
            return UIViewController()
        case .profile:
            return MyPageViewController()
        }
    }
}
