import { UMB_USER_ROOT_ENTITY_TYPE } from '../../entity.js';

import { manifests as modalManifests } from './modal/manifests.js';

import type { ManifestTypes, UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes | UmbBackofficeManifestKind> = [
	{
		type: 'entityAction',
		kind: 'default',
		alias: 'Umb.EntityAction.User.Create',
		name: 'Create User Entity Action',
		weight: 1200,
		api: () => import('./create-user-entity-action.js'),
		forEntityTypes: [UMB_USER_ROOT_ENTITY_TYPE],
		meta: {
			icon: 'icon-add',
			label: '#actions_create',
		},
	},
	...modalManifests,
];