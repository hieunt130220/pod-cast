//
//  MyPageViewController.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 7/5/24.
//

import UIKit

class MyPageViewController: UIViewController, Paginable {

    @IBOutlet weak var tableView: UITableView!
    private lazy var refreshControl = UIRefreshControl()
    
    private var myPostCasts: [PostCast] = []
    private var user: User? {
        didSet {
            guard let user = user else { return }
            LocalData.shared.userId = user.id
            fetch()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        refreshControl.addTarget(self, action: #selector(refresh), for: .valueChanged)
        tableView.refreshControl = refreshControl
        tableView.registerNib(PostCastItemCell.self)
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = .systemGray6
        getUser()
    }
    
    @objc private func refresh() {
        reload()
    }
    
    private func getUser() {
        AppRepository.user.getMe { user in
            self.user = user
            self.tableView.reloadData()
        } failure: { error, statusCode in
            
        }
    }
    
    // MARK: Paginable
    
    typealias Element = [PostCast]
    var page: Int = 1
    var per: Int = 10
    var isFetchingItems: Bool = false
    var isNotFoundItems: Bool = false
    var hasNextPage: Bool = true
    
    func fetch(completion: @escaping (_ result: Element, _ hasNextPage: Bool?) -> Void, failure: @escaping (_ error: NSError?, _ statusCode: Int?) -> Void) {
        let isFirstPage = (self.page == 1)
        isFetchingItems = true
        
        // define closures in advance
        let completionClosure: (_ postCasts: [PostCast], _ hasNextPage: Bool) -> Void = { [weak self] (postCasts, hasNextPage) in
            guard let `self` = self else { return }
            if isFirstPage {
                self.refreshControl.endRefreshing()
                self.myPostCasts = []
            }
            self.myPostCasts.append(contentsOf: postCasts)
            let offset = self.tableView.contentOffset
            self.tableView.reloadData()
            self.tableView.setContentOffset(offset, animated: false)
            self.isFetchingItems = false
            completion(postCasts, hasNextPage)
            self.hasNextPage = false
        }
        let failureClosure: (_ error: NSError?, _ statusCode: Int?) -> Void = { (error, statusCode) in
            self.refreshControl.endRefreshing()
            print("Error error= \(String(describing: error)), StatusCode= \(String(describing: statusCode))")
        }
        AppRepository.podCast.getPostCast(by: user!.id, page: page, per: per, completion: completionClosure, failure: failureClosure)
    }
    func updateDataSource(_ items: Element) {}
}

extension MyPageViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(PostCastItemCell.self, for: indexPath)
        cell.postCast = myPostCasts[indexPath.row]
        cell.delegate = self
        return cell
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return myPostCasts.count
    }
}

extension MyPageViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let view = ProfileHeaderView()
        view.backgroundColor = .white
        view.user = self.user
        return view
    }
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return UITableView.automaticDimension
    }
}

extension MyPageViewController: UIScrollViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        paginate(scrollView)
    }
}

extension MyPageViewController: PostCastItemCellDelegate {
    func postCastItemCell(didTapLikeButtonInside cell: PostCastItemCell) {
        guard let postCast = cell.postCast else { return }
        if postCast.isLike {
            postCast.isLike = false
            postCast.likeCount -= 1
            tableView.reloadData()
            AppRepository.podCast.unLike(postId: postCast.id,
                                         completion: { [weak self] success in
                guard let `self` = self else { return }
                if !success {
                    // rollback
                    postCast.isLike = false
                    postCast.likeCount += 1
                    self.tableView.reloadData()
                }
            }, failure: { [weak self] _, _ in
                guard let `self` = self else { return }
                // rollback
                postCast.isLike = false
                postCast.likeCount += 1
                self.tableView.reloadData()
            })
        } else {
            postCast.isLike = true
            postCast.likeCount += 1
            tableView.reloadData()
            AppRepository.podCast.like(postId: postCast.id,
                                         completion: { [weak self] success in
                guard let `self` = self else { return }
                if !success {
                    // rollback
                    postCast.isLike = false
                    postCast.likeCount -= 1
                    self.tableView.reloadData()
                }
            }, failure: { [weak self] _, _ in
                guard let `self` = self else { return }
                // rollback
                postCast.isLike = false
                postCast.likeCount -= 1
                self.tableView.reloadData()
            })
        }
    }
    
    func postCastItemCell(didTapCommentButtonInside cell: PostCastItemCell) {
        
    }
    
    func postCastItemCell(didTapPlayButtonInside cell: PostCastItemCell) {
        
    }
    
    
}
