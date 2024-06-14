//
//  CommentPodCastViewController.swift
//  podcast
//
//  Created by HieuNT on 21/05/2024.
//

import UIKit

class CommentPodCastViewController: UIViewController, Paginable {

    @IBOutlet weak var bottomContainerViewConstraint: NSLayoutConstraint!
    @IBOutlet weak var containerView: UIView!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var postCommentBtn: UIButton!
    @IBOutlet weak var commentTf: UITextField!
    
    private lazy var refreshControl = UIRefreshControl()
    
    private var comments: [Comment] = []
    var podCast: PodCast?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        title = "Comment"
        refreshControl.addTarget(self, action: #selector(refresh), for: .valueChanged)
        tableView.refreshControl = refreshControl
        tableView.registerNib(PodCastItemCell.self)
        tableView.registerNib(CommentItemCell.self)
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = .systemGray6
        tableView.contentInset = UIEdgeInsets(top: 16, left: 0, bottom: 0, right: 0)
        commentTf.delegate = self
        
        fetch()
    }
    
    @IBAction func postComment(_ sender: Any) {
        guard let comment = commentTf.text, !comment.isEmpty else { return }
        view.activityIndicatorView.startAnimating()
        AppRepository.podCast
            .postComment(postId: podCast!.id, comment: comment, completion: {[weak self] comment in
                self?.view.activityIndicatorView.stopAnimating()
                self?.commentTf.text = ""
                self?.comments.insert(comment, at: 0)
                self?.tableView.reloadData()
            }, failure: {[weak self] error,statusCode in
                if statusCode == StatusCode.notFound.rawValue {
                    self?.showMessage("Pod cast has beed delete")
                }
                self?.view.activityIndicatorView.stopAnimating()
            })
    }
    
    @objc private func refresh() {
        reload()
    }

    // MARK: Paginable
    
    typealias Element = [Comment]
    var page: Int = 1
    var per: Int = 10
    var isFetchingItems: Bool = false
    var isNotFoundItems: Bool = false
    var hasNextPage: Bool = true
    
    func fetch(completion: @escaping (_ result: Element, _ hasNextPage: Bool?) -> Void, failure: @escaping (_ error: NSError?, _ statusCode: Int?) -> Void) {
        let isFirstPage = (self.page == 1)
        isFetchingItems = true
        
        // define closures in advance
        let completionClosure: (_ comments: [Comment], _ hasNextPage: Bool) -> Void = { [weak self] (comments, hasNextPage) in
            guard let `self` = self else { return }
            if isFirstPage {
                self.refreshControl.endRefreshing()
                self.comments = []
            }
            self.comments.append(contentsOf: comments)
            let offset = self.tableView.contentOffset
            self.tableView.reloadData()
            self.tableView.setContentOffset(offset, animated: false)
            self.isFetchingItems = false
            completion(comments, hasNextPage)
            self.hasNextPage = false
        }
        let failureClosure: (_ error: NSError?, _ statusCode: Int?) -> Void = { (error, statusCode) in
            self.refreshControl.endRefreshing()
            print("Error error= \(String(describing: error)), StatusCode= \(String(describing: statusCode))")
        }
        AppRepository.podCast.getComments(postId: podCast!.id, page: page, per: per, completion: completionClosure, failure: failureClosure)
    }
    func updateDataSource(_ items: Element) {}
}

extension CommentPodCastViewController: UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section == 0 {
            let cell = tableView.dequeueReusableCell(PodCastItemCell.self, for: indexPath)
            cell.commentBtn.isHidden = true
            cell.podCast = podCast
            cell.delegate = self
            return cell
        }
        let cell = tableView.dequeueReusableCell(CommentItemCell.self, for: indexPath)
        cell.comment = comments[indexPath.row]
        return cell
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section == 0 {
            return 1
        }
        return comments.count
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }
}

extension CommentPodCastViewController: UITableViewDelegate {
   
}

extension CommentPodCastViewController: UIScrollViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        paginate(scrollView)
    }
}

extension CommentPodCastViewController: PodCastItemCellDelegate {
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
        
    }
    
    func podCastItemCell(didTapDeleteButtonInside cell: PodCastItemCell) {
        
    }
}

extension CommentPodCastViewController: UITextFieldDelegate {
    
}
