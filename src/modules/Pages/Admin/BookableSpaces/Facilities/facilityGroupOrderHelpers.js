const getValidGroupOrder = group => {
    const parsedOrder = Number(group?.facility_type_group_order);
    return Number.isInteger(parsedOrder) && parsedOrder > 0 ? parsedOrder : null;
};

export const orderFacilityTypeGroups = groups => {
    return [...(groups || [])]
        .map((group, index) => ({
            group,
            index,
            order: getValidGroupOrder(group),
        }))
        .sort((a, b) => {
            const aHasOrder = a?.order !== null;
            const bHasOrder = b?.order !== null;

            if (aHasOrder && bHasOrder) {
                return a.order - b.order;
            }

            if (aHasOrder !== bHasOrder) {
                return aHasOrder ? -1 : 1;
            }

            // Keep backend-provided ordering when group_order is absent.
            return a.index - b.index;
        })
        .map(item => item.group);
};

export const buildFacilityGroupOrderPayload = groups => {
    return (groups || []).map((group, index) => ({
        facility_type_group_id: group?.facility_type_group_id,
        facility_type_group_order: index + 1,
    }));
};
