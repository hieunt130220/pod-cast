//  AppNavigator.swift

import UIKit

protocol AppNavigatorType: AnyObject {
    var window: UIWindow? { get }
    func start()
    func switchToMain()
    func switchToAuth()
}

final class AppNavigator: AppNavigatorType {
    var window: UIWindow?
    
    init(window: UIWindow?) {
        self.window = window
    }
    
    func start() {
        if LocalData.shared.token.isEmpty {
            switchToAuth()
        } else {
            switchToMain()
        }
    }
    
    func switchToMain() {
        switchTo(viewController: UINavigationController(rootViewController: MainTabbarViewController()))
    }
    
    func switchToAuth() {
        switchTo(viewController: UINavigationController(rootViewController: LoginViewController()))
    }
    
    func switchTo(viewController: UIViewController) {
        guard let window = window else { return }
        window.rootViewController = viewController
        window.makeKeyAndVisible()
        UIView.transition(with: window, duration: 0.3, options: [.transitionCrossDissolve],
                          animations: {}, completion: {completed in
        })
    }
    
}
