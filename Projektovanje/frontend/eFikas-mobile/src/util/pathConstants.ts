import ReactNativeBlobUtil from "react-native-blob-util";

const BASE_PATH = ReactNativeBlobUtil.fs.dirs.DownloadDir;

export const PATH_CONSTANTS = {
    incomeBookPath: `${BASE_PATH}/income/`,
    expensesBookPath: `${BASE_PATH}/expenses/`,
    guestsBookPath: `${BASE_PATH}/guests/`,
}