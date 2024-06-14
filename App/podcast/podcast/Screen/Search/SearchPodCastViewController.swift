//
//  SearchPodCastViewController.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 21/5/24.
//

import UIKit

class SearchPodCastViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    
    private lazy var refreshControl = UIRefreshControl()
    
    private var podCasts: [PodCast] = []
    
    var textSearch: String = "" {
        didSet {
            guard isViewLoaded else { return }
            guard !textSearch.isEmpty else { return }
            fetch()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        refreshControl.addTarget(self, action: #selector(fetch), for: .valueChanged)
        tableView.refreshControl = refreshControl
        tableView.registerNib(PodCastItemCell.self)
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = .systemGray6
        tableView.contentInset = UIEdgeInsets(top: 16, left: 0, bottom: 0, right: 0)
    }
    
    @objc private func fetch() {
        AppRepository.podCast.search(caption: textSearch) {[weak self] podCasts in
            self?.podCasts = []
            self?.podCasts = podCasts
            self?.tableView.reloadData()
            self?.refreshControl.endRefreshing()
        } failure: {[weak self] error, statusCode in
            self?.refreshControl.endRefreshing()
        }

    }
}

extension SearchPodCastViewController: UITableViewDataSource {
   
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

extension SearchPodCastViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let vc = PodCastViewController()
        vc.podCast = podCasts[indexPath.row]
        vc.modalPresentationStyle = .fullScreen
        vc.hidesBottomBarWhenPushed = true
        navigationController?.pushViewController(vc, animated: true)
    }
    
}

extension SearchPodCastViewController: PodCastItemCellDelegate {
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
    
    func podCastItemCell(didTapCommentButtonInside cell: PodCastItemCell) {
        let vc = CommentPodCastViewController()
        vc.hidesBottomBarWhenPushed = true
        vc.podCast = cell.podCast
        navigationController?.pushViewController(vc, animated: true)
    }
    
    func podCastItemCell(didTapDeleteButtonInside cell: PodCastItemCell) {
        
    }
}

