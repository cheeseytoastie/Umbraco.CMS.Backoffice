const { rest } = window.MockServiceWorker;
import { umbMediaTypeData } from '../../data/media-type.data.js';
import { UMB_SLUG } from './slug.js';
import { umbracoPath } from '@umbraco-cms/backoffice/utils';

export const treeHandlers = [
	rest.get(umbracoPath(`/tree${UMB_SLUG}/root`), (req, res, ctx) => {
		const rootItems = umbMediaTypeData.getTreeRoot();
		const response = {
			total: rootItems.length,
			items: rootItems,
		};
		return res(ctx.status(200), ctx.json(response));
	}),

	rest.get(umbracoPath(`/tree${UMB_SLUG}/children`), (req, res, ctx) => {
		const parentId = req.url.searchParams.get('parentId');
		if (!parentId) return;

		const children = umbMediaTypeData.getTreeItemChildren(parentId);

		const response = {
			total: children.length,
			items: children,
		};

		return res(ctx.status(200), ctx.json(response));
	}),
];