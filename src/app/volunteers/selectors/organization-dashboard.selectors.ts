import { createSelector } from '@ngrx/store';
import { selectSessionOrganization } from '../../auth/selectors/session.selectors';
import * as RouterActions from '../../core/actions/router.actions';
import { selectModelSites } from '../../core/selectors/model.selectors';
import { HeaderOptions, Organization, SidenavOptions, Site } from '../../shared/models';

export const selectOrganizationDashboardHeaderOptions = createSelector(
  selectSessionOrganization,
  (organization: Organization): HeaderOptions => organization
    ? new HeaderOptions(
      organization.name,
      'business',
      null,
      true,
    )
    : null,
);

export const selectOrganizationDashboardSidenavOptions = createSelector(
  selectModelSites,
  (sites: Site[]): SidenavOptions[] => sites && sites.reduce(
    (options, site) =>
      [
        ...options,
        new SidenavOptions(
          'Check in',
          'done',
          new RouterActions.Go({ path: [`organization/volunteers/${site.id}/check-in`] }),
        ),
        new SidenavOptions(
          'Check out',
          'done_all',
          new RouterActions.Go({ path: [`organization/volunteers/${site.id}/check-out`] }),
        ),
      ],
    [],
  ),
);