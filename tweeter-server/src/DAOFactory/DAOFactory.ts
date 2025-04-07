import { IFollowDAO } from "../dao-interface/IFollowDAO";
import { IS3DAO } from "../dao-interface/IS3DAO";
import { ISessionDAO } from "../dao-interface/ISessionDAO";
import { IStatusDAO } from "../dao-interface/IStatusDAO";
import { IUserDAO } from "../dao-interface/IUserDAO";
import { DynamoFollowDAO } from "../dynamo-daos/DynamoFollowDAO";
import { DynamoS3DAO } from "../dynamo-daos/DynamoS3DAO";
import { DynamoSessionDAO } from "../dynamo-daos/DynamoSessionDAO";
import { DynamoStatusDAO } from "../dynamo-daos/DynamoStatusDAO";
import { DynamoUserDAO } from "../dynamo-daos/DynamoUserDAO";

export class DAOFactory {
    private static followDAOInstance: IFollowDAO | null = null;
    private static userDAOInstance: IUserDAO | null = null;
    private static sessionDAOInstance: ISessionDAO | null = null;
    private static statusDAOInstance: IStatusDAO | null = null;

    public static getFollowDAO(): IFollowDAO {
        if (!this.followDAOInstance) {
            this.followDAOInstance = new DynamoFollowDAO();
        }
        return this.followDAOInstance;
    }

    public static getUserDAO(): IUserDAO {
        if (!this.userDAOInstance) {
            const s3DAO: IS3DAO = new DynamoS3DAO(); // Assuming S3DAO is a valid implementation of IS3DAO
            this.userDAOInstance = new DynamoUserDAO(s3DAO);
        }
        return this.userDAOInstance;
    }

    public static getSessionDAO(): ISessionDAO {
        if (!this.sessionDAOInstance) {
            this.sessionDAOInstance = new DynamoSessionDAO();
        }
        return this.sessionDAOInstance;
    }

    public static getStatusDAO(): IStatusDAO {
        if (!this.statusDAOInstance) {
            this.statusDAOInstance = new DynamoStatusDAO();
        }
        return this.statusDAOInstance;
    }
}
