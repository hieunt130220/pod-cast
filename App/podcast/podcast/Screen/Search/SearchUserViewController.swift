//
//  SearchUserViewController.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 21/5/24.
//

import UIKit

class SearchUserViewController: UIViewController {

    @IBOutlet weak var tableView: UITableView!
    
    var textSearch: String = "" {
        didSet {
            guard !textSearch.isEmpty else { return }
            fetch()
        }
    }
    
    private lazy var refreshControl = UIRefreshControl()
    
    private var users: [User] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        refreshControl.addTarget(self, action: #selector(fetch), for: .valueChanged)
        tableView.refreshControl = refreshControl
        tableView.registerNib(SearchUserCell.self)
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = .systemGray6
        tableView.contentInset = UIEdgeInsets(top: 16, left: 0, bottom: 0, right: 0)
    }
    
    @objc private func fetch() {
        AppRepository.user.search(userName: textSearch) {[weak self] users in
            self?.users = []
            self?.users = users
            self?.tableView.reloadData()
            self?.refreshControl.endRefreshing()
        } failure: {[weak self] error, statusCode in
            self?.refreshControl.endRefreshing()
        }

    }
}

extension SearchUserViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return users.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(SearchUserCell.self, for: indexPath)
        cell.user = users[indexPath.row]
        return cell
    }
    
    
}

extension SearchUserViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let user = users[indexPath.row]
        if user.isMe {
            let vc = MyPageViewController()
            vc.hidesBottomBarWhenPushed = true
            navigationController?.pushViewController(vc, animated: true)
        } else {
            let vc = OtherUserViewController()
            vc.user = user
            vc.hidesBottomBarWhenPushed = true
            navigationController?.pushViewController(vc, animated: true)
        }
    }
}
