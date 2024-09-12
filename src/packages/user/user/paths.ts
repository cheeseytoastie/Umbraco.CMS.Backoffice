import { UMB_USER_SECTION_PATHNAME } from '../user-section/paths.js';
import { UMB_USER_ENTITY_TYPE } from './entity.js';
import { UMB_WORKSPACE_PATH_PATTERN } from '@umbraco-cms/backoffice/workspace';

export const UMB_USER_WORKSPACE_PATH = UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
	sectionName: UMB_USER_SECTION_PATHNAME,
	entityType: UMB_USER_ENTITY_TYPE,
});