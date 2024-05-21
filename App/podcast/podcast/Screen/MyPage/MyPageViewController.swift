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
    
    private var myPodCasts: [PodCast] = []
    private var user: User? {
        didSet {
            guard let user = user else { return }
            LocalData.shared.userId = user.id
            reload()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "My Page"
        navigationItem.rightBarButtonItem = UIBarButtonItem(image: UIImage(systemName: "gear"), style: .done, target: self, action: #selector(setting))
        refreshControl.addTarget(self, action: #selector(refresh), for: .valueChanged)
        tableView.refreshControl = refreshControl
        tableView.registerNib(PodCastItemCell.self)
        tableView.delegate = self
        tableView.dataSource = self
        tableView.backgroundColor = .systemGray6
        getUser()
    }
    
    @objc private func setting() {
        let vc = SettingViewController()
        vc.hidesBottomBarWhenPushed = true
        navigationController?.pushViewController(vc, animated: true)
    }
    
    @objc private func refresh() {
        getUser()
    }
    
    private func getUser() {
        AppRepository.user.getMe { user in
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
                self.myPodCasts = []
            }
            self.myPodCasts.append(contentsOf: postCasts)
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

extension MyPageViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(PodCastItemCell.self, for: indexPath)
        cell.podCast = myPodCasts[indexPath.row]
        cell.delegate = self
        return cell
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return myPodCasts.count
    }
}

extension MyPageViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let vc = PodCastViewController()
        vc.podCast = myPodCasts[indexPath.row]
        vc.modalPresentationStyle = .fullScreen
        vc.hidesBottomBarWhenPushed = true
        navigationController?.pushViewController(vc, animated: true)
    }
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let view = ProfileHeaderView()
        view.backgroundColor = .white
        view.user = self.user
        view.changeAvatar.isHidden = false
        view.editName.isHidden = false
        view.delegate = self
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

extension MyPageViewController: PodCastItemCellDelegate {
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
}

extension MyPageViewController: ProfileHeaderViewDelegate, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
    func profileHeaderView(didTapEditNameInside view: ProfileHeaderView) {
        let alert = UIAlertController(title: "Edit user name", message: "", preferredStyle: .alert)
        alert.addTextField { tf in
            tf.placeholder = "User name"
            tf.text = self.user?.username
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { action in
            guard let userName = alert.textFields![0].text?.trimmingCharacters(in: .whitespaces), !userName.isEmpty, userName != self.user?.username else {
                return
            }
            self.view.activityIndicatorView.startAnimating()
            AppRepository.user.update(userName: userName) { user in
                self.user = user
                self.view.activityIndicatorView.stopAnimating()
            } failure: { error, statusCode in
                self.showMessage("User name already exist")
                self.view.activityIndicatorView.stopAnimating()
            }
        }))
        present(alert, animated: true)
    }
    
    func profileHeaderView(didTapChangeAvatarInside view: ProfileHeaderView) {
        let picker = UIImagePickerController()
        picker.sourceType = .photoLibrary
        picker.allowsEditing = true
        picker.delegate = self
        present(picker, animated: true)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: false)
        guard let image = info[.editedImage] as? UIImage else { return }
        view.activityIndicatorView.startAnimating()
        AppRepository.user.update(avatar: image.jpegData(compressionQuality: 1)) { user in
            self.user = user
            self.view.activityIndicatorView.stopAnimating()
        } failure: { error, statusCode in
            self.showMessage("Update failed")
            self.view.activityIndicatorView.stopAnimating()
        }
    }
}
