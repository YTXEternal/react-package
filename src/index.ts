

import './plugins/style';

export { UxTable } from './components/UxTable';
export type { UxTableProps, UxTableColumn, UxTableRef } from './components/UxTable/types/props';
export type { SelectionState as SelectionBounds } from './components/UxTable/hooks/useSelection/types';

// DataSource is just a generic parameter in UxTableProps, it's not explicitly exported as a standalone type.
// If needed, users can define their own DataSource types.