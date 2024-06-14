//
//  OtherUserViewController.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 21/5/24.
//

import UIKit

class OtherUserViewController: UIViewController, Paginable {
    
    @IBOutlet weak var tableView: UITableView!
    private lazy var refreshControl = UIRefreshControl()
    
    private var podCasts: [PodCast] = []
    var user: User? {
        didSet {
            guard let user = user else { return }
            title = user.username
            fetch()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        refreshControl.addTarget(self, action: #selector(refresh), for: .valueChanged)
        tableView.refreshControl = refreshControl
        tableView.registerNib(PodCastItemCell.self)
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = .systemGray6
        getUser()
    }
    
    @objc private func refresh() {
        reload()
    }
    
    private func getUser() {
        AppRepository.user.getOtherUser(uid: user!.id) { user in
            self.user = user
            self.tableView.reloadData()
        } failure: { error, statusCode in
            
        }
    }
    
    // MARK: Paginable
    
    typealias Element = [PodCast]
    var page: Int = 1
    var per: Int = 10
    var isFetchingItems: Bool = false
    var isNotFoundItems: Bool = false
    var hasNextPage: Bool = true
    
    func fetch(completion: @escaping (_ result: Element, _ hasNextPage: Bool?) -> Void, failure: @escaping (_ error: NSError?, _ statusCode: Int?) -> Void) {
        let isFirstPage = (self.page == 1)
        isFetchingItems = true
        
        // define closures in advance
        let completionClosure: (_ postCasts: [PodCast], _ hasNextPage: Bool) -> Void = { [weak self] (postCasts, hasNextPage) in
            guard let `self` = self else { return }
            if isFirstPage {
                self.refreshControl.endRefreshing()
                self.podCasts = []
            }
            self.podCasts.append(contentsOf: postCasts)
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
        AppRepository.podCast.getPodCast(by: user!.id, page: page, per: per, completion: completionClosure, failure: failureClosure)
    }
    func updateDataSource(_ items: Element) {}
    
}

extension OtherUserViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(PodCastItemCell.self, for: indexPath)
        cell.podCast = podCasts[indexPath.row]
        cell.delegate = self
        return cell
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return podCasts.count
    }
}

extension OtherUserViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let vc = PodCastViewController()
        vc.podCast = podCasts[indexPath.row]
        vc.modalPresentationStyle = .fullScreen
        vc.hidesBottomBarWhenPushed = true
        navigationController?.pushViewController(vc, animated: true)
    }
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let view = OtherUserHeaderView()
        view.backgroundColor = .white
        view.user = self.user
        view.delegate = self
        return view
    }
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return UITableView.automaticDimension
    }
}

extension OtherUserViewController: UIScrollViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        paginate(scrollView)
    }
}

extension OtherUserViewController: PodCastItemCellDelegate {
    func podCastItemCell(didTapLikeButtonInside cell: PodCastItemCell) {
        guard let postCast = cell.podCast else { return }
        if postCast.isLike {
            postCast.isLike = false
            postCast.likeCount -= 1
            tableView.reloadData()
            AppRepository.podCast.unLike(postId: postCast.id,
                                         completion: { [weak self] success in
                guard let `self` = self else { return }
                if !success {
                    // rollback
                    postCast.isLike = true
                    postCast.likeCount += 1
                    self.tableView.reloadData()
                }
            }, failure: { [weak self] _, _ in
                guard let `self` = self else { return }
                // rollback
                postCast.isLike = true
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
    
    func podCastItemCell(didTapCommentButtonInside cell: PodCastItemCell) {
        let vc = CommentPodCastViewController()
        vc.hidesBottomBarWhenPushed = true
        vc.podCast = cell.podCast
        navigationController?.pushViewController(vc, animated: true)
    }
    
    func podCastItemCell(didTapDeleteButtonInside cell: PodCastItemCell) {
        
    }
}

extension OtherUserViewController: OtherUserHeaderViewDelegate {
    func otherUserHeaderView(didTapFollowBtnInside view: OtherUserHeaderView) {
        guard let user = user else { return }
        if user.isFollowing {
            user.isFollowing = false
            user.followers -= 1
            tableView.reloadData()
            AppRepository.user.unFollow(uid: user.id,
                                         completion: { [weak self] success in
                guard let `self` = self else { return }
                if !success {
                    // rollback
                    user.isFollowing = true
                    user.followers += 1
                    self.tableView.reloadData()
                }
            }, failure: { [weak self] _, _ in
                guard let `self` = self else { return }
                // rollback
                user.isFollowing = true
                user.followers += 1
                self.tableView.reloadData()
            })
        } else {
            user.isFollowing = true
            user.followers += 1
            tableView.reloadData()
            AppRepository.user.follow(uid: user.id,
                                         completion: { [weak self] success in
                guard let `self` = self else { return }
                if !success {
                    // rollback
                    user.isFollowing = false
                    user.followers -= 1
                    self.tableView.reloadData()
                }
            }, failure: { [weak self] _, _ in
                guard let `self` = self else { return }
                // rollback
                user.isFollowing = false
                user.followers -= 1
                self.tableView.reloadData()
            })
        }
    }
}
