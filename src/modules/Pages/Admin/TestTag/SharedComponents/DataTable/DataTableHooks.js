import React, { useState, useEffect, useMemo } from 'react';
import ActionCell from './ActionCell';

export const useDataTableRow = (data = [], transform) => {
    const [row, _setRow] = useState(!!transform ? transform(data) : data);
    const setRow = data => _setRow(!!transform ? transform(data) : data);
    useEffect(() => {
        setRow(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(data)]);

    return { row, setRow };
};

export const useDataTableColumns = ({
    config,
    locale,
    handleEditClick,
    handleDeleteClick,
    editIcon,
    deleteIcon,
    filterKey = null,
    withActions = true,
    actionDataFieldKeys,
    shouldDisableEdit,
    shouldDisableDelete,
    actionTooltips,
    getTooltips,
}) => {
    const columns = useMemo(
        () => {
            const actionsCell = withActions
                ? {
                      field: '',
                      renderCell: params => {
                          const disableEdit = shouldDisableEdit?.(params.row, filterKey) ?? false;
                          const disableDelete = shouldDisableDelete?.(params.row, filterKey) ?? false;

                          const tooltips =
                              getTooltips?.({
                                  row: params.row,
                                  filterKey,
                                  tooltips: actionTooltips,
                              }) ?? actionTooltips;

                          return (
                              <ActionCell
                                  {...params}
                                  {...(!!handleEditClick ? { handleEditClick: handleEditClick } : {})}
                                  {...(!!handleDeleteClick ? { handleDeleteClick: handleDeleteClick } : {})}
                                  {...(!!editIcon ? { editIcon } : {})}
                                  {...(!!deleteIcon ? { deleteIcon } : {})}
                                  {...(!!actionDataFieldKeys ? { dataFieldKeys: actionDataFieldKeys } : {})}
                                  {...(!!actionTooltips ? { tooltips } : {})}
                                  disableEdit={disableEdit}
                                  disableDelete={disableDelete}
                              />
                          );
                      },
                      sortable: false,
                      width: 100,
                      headerAlign: 'center',
                      filterable: false,
                      align: 'center',
                      disableColumnMenu: true,
                      disableReorder: true,
                      renderInUpdate: false,
                  }
                : undefined;

            const columns = [];
            const configFiltered = !!!filterKey ? config : config?.[filterKey];
            const localeFiltered = !!!filterKey ? locale : locale?.[filterKey];

            const keys = Object.keys(configFiltered.fields);

            keys.forEach(key => {
                !!(configFiltered?.fields?.[key]?.fieldParams?.renderInTable ?? true) &&
                    columns.push({
                        field: key,
                        headerName: localeFiltered[key].label,
                        editable: false,
                        ...configFiltered.fields[key].fieldParams,
                    });
            });

            withActions && columns && columns.length > 0 && columns.push(actionsCell);
            return columns;
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [handleDeleteClick, handleEditClick, filterKey],
    );

    return { columns };
};
