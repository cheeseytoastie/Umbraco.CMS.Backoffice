import type { ManifestWithDynamicConditions } from '@umbraco-cms/backoffice/extension-api';

export interface ManifestUserPermission extends ManifestWithDynamicConditions {
	type: 'userPermission';
	meta: MetaUserPermission;
}

export interface MetaUserPermission {
	entityType: string;
	label?: string;
	labelKey?: string;
	description?: string;
	descriptionKey?: string;
	group?: string;
}
