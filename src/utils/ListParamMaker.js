import DateUtil from "utils/DateUtil";

//TODO 컴포넌트 상속 or mixin으로 수정
//TODO 없어질? 함수

const NOT_FILTER = [
    'undefined',
    'start_index', 'row_count', 'sorting', 'sorting_type',
    'startDate', 'endDate',
]

class ListParamMaker {
    static make(data) {
        const filter = {};

        for (const [key, value] of Object.entries(data)) {
            if (NOT_FILTER.includes(key)) continue;

            filter[key] = value;
        }

        if (data.startDate && data.endDate) {
            filter.create_date = [DateUtil.parseDateToYYYYMMDD(data.startDate), DateUtil.parseDateToYYYYMMDD(data.endDate)];
        }

        const params = {
            start_index: data.start_index,
            row_count: data.row_count,
            filters: JSON.stringify(filter)
        };

        if (data.sorting) {
            params.sorting = data.sorting;
            params.sorting_type = (data.sorting_type) ? 'asc' : 'desc';
        }

        return params;
    }
}

export default ListParamMaker;