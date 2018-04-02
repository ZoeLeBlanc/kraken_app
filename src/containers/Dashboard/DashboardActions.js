export const LOAD_CSV_OPTIONS = 'LOAD_CSV_OPTIONS';
export const SAVING_CSV = 'SAVING_CSV';

export const loadCSVOptions = (json) => ({
    type: 'LOAD_CSV_OPTIONS',
    graph: json
});

export const savingCSV = () => ({
    type: 'SAVING_CSV'
});
export const saveCSV = (file) => {
    return (dispatch) => {
        dispatch(savingCSV());
        const formData = new FormData();

        formData.append('file', file);
        formData.forEach((value, key) => {
            console.log(key + ' ' + value);
        });
        return fetch('http://localhost:7082/api/load_csv', {
            method: 'POST',
            body: formData
        }).then((response) => {
            response.json()
                .catch(err => {
                    return err;
                })
                .then(json => {
                    dispatch(loadCSVOptions(json));
                });
        });
    };
};
