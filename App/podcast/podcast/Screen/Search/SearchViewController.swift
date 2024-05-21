//
//  SearchViewController.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import UIKit
import SnapKit
class SearchViewController: UIViewController {

    @IBOutlet weak var podCastBtn: MenuButton!
    @IBOutlet weak var userBtn: MenuButton!
    @IBOutlet weak var containerView: UIView!
    
    private lazy var searchController = UISearchController()
    
    private lazy var pageViewController: UIPageViewController = {
        let controller = UIPageViewController(transitionStyle: .scroll, navigationOrientation: .horizontal, options: nil)
        addChild(controller)
        containerView.addSubview(controller.view)
        return controller
    }()
    
    lazy var userVc = SearchUserViewController()
    
    lazy var podCastVc = SearchPodCastViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Search"
        podCastBtn.isSelected = false
        userBtn.isSelected = true
        searchController.delegate = self
        searchController.searchBar.delegate = self
        navigationItem.searchController = searchController
        pageViewController.setViewControllers([userVc], direction: .forward, animated: false)
        pageViewController.view.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }
    
    @IBAction func tapUser(_ sender: Any) {
        userBtn.isSelected = true
        podCastBtn.isSelected = false
        pageViewController.setViewControllers([userVc], direction: .reverse, animated: true)
    }
    
    @IBAction func tapPodCast(_ sender: Any) {
        podCastBtn.isSelected = true
        userBtn.isSelected = false
        pageViewController.setViewControllers([podCastVc], direction: .forward, animated: true)
    }
}

extension SearchViewController: UISearchControllerDelegate {
    
}

extension SearchViewController: UISearchBarDelegate {

    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        userVc.textSearch = searchBar.text ?? ""
        podCastVc.textSearch = searchBar.text ?? ""
    }
}
