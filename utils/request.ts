import axios from "axios";
import { SERVER_URL } from "./enum";

export default axios.create({
  baseURL: SERVER_URL,
});
