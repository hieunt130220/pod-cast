//
//  Paginable.swift
//  podcast
//
//  Created by Nguyen Trung Hieu on 8/5/24.
//

import UIKit
protocol Paginable: class {
    associatedtype Element
    var page: Int { get set }
    var per: Int { get }
    var isFetchingItems: Bool { get set }
    var isNotFoundItems: Bool { get set }
    var hasNextPage: Bool { get set }
    
    func fetch(completion: @escaping (_ result: Element, _ hasNextPage: Bool?) -> Void, failure: @escaping (_ error: NSError?, _ statusCode: Int?) -> Void)
    func updateDataSource(_ items: Element)
    func reload()
    func paginate(_ scrollView: UIScrollView)
}

extension Paginable where Self: UIViewController {
    func reload() {
        guard self.viewIfLoaded != nil else {
            return
        }
        self.page = 1
        self.hasNextPage = true
        self.isFetchingItems = false
        self.isNotFoundItems = false
        self.fetch()
    }
    func paginate(_ scrollView: UIScrollView) {
        let bottomContentOffset = scrollView.contentSize.height - scrollView.bounds.height
        let boundary = bottomContentOffset - (500 - scrollView.contentInset.bottom)
        if scrollView.contentOffset.y > boundary {
            fetch()
        }
    }
    func fetch(completion: (() -> Void)? = nil, failure: (() -> Void)? = nil) {
        if self.isFetchingItems || self.isNotFoundItems || !self.hasNextPage {
            failure?()
            return
        }
        self.isFetchingItems = true
        self.fetch(
            completion: { [weak self] items, hasNextPage in
                guard let `self` = self else { return }
                self.updateDataSource(items)
                self.page += 1
                self.isFetchingItems = false
                if let hasNextPage = hasNextPage {
                    self.hasNextPage = hasNextPage
                }
                completion?()
        },
            failure: { [weak self] error, statusCode in
                guard let `self` = self else { return }
                self.isNotFoundItems = true //statusCode == StatusCode.notFound.rawValue
                self.isFetchingItems = false
                failure?()
        }
        )
    }
}

extension Paginable where Self: UIView {
    func reload() {
        self.page = 1
        self.hasNextPage = true
        self.isFetchingItems = false
        self.isNotFoundItems = false
        self.fetch()
    }
    func paginate(_ scrollView: UIScrollView) {
        let bottomContentOffset = scrollView.contentSize.height - scrollView.bounds.height
        let boundary = bottomContentOffset - (500 - scrollView.contentInset.bottom)
        if scrollView.contentOffset.y > boundary {
            fetch()
        }
    }
    func fetch(completion: (() -> Void)? = nil, failure: (() -> Void)? = nil) {
        if self.isFetchingItems || self.isNotFoundItems || !self.hasNextPage {
            failure?()
            return
        }
        self.isFetchingItems = true
        self.fetch(
            completion: { [weak self] items, hasNextPage in
                guard let `self` = self else { return }
                self.updateDataSource(items)
                self.page += 1
                self.isFetchingItems = false
                if let hasNextPage = hasNextPage {
                    
                    self.hasNextPage = hasNextPage
                }
                completion?()
        },
            failure: { [weak self] error, statusCode in
                guard let `self` = self else { return }
                self.isNotFoundItems = true //statusCode == StatusCode.notFound.rawValue
                self.isFetchingItems = false
                failure?()
        }
        )
    }
}
