import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateCommentData {
  comment_insert: Comment_Key;
}

export interface CreateCommentVariables {
  taskId: UUIDString;
  content: string;
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateTagData {
  tag_insert: Tag_Key;
}

export interface CreateTagVariables {
  name: string;
  color: string;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  projectId: UUIDString;
  title: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}

export interface DeleteCommentVariables {
  id: UUIDString;
}

export interface DeleteProjectData {
  project_delete?: Project_Key | null;
}

export interface DeleteProjectVariables {
  id: UUIDString;
}

export interface DeleteTagData {
  tag_delete?: Tag_Key | null;
}

export interface DeleteTagVariables {
  id: UUIDString;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetCommentData {
  comment?: {
    content: string;
  };
}

export interface GetCommentVariables {
  id: UUIDString;
}

export interface GetProjectData {
  project?: {
    title: string;
    description?: string | null;
  };
}

export interface GetProjectVariables {
  id: UUIDString;
}

export interface GetTagData {
  tag?: {
    name: string;
    colorCode: string;
  };
}

export interface GetTagVariables {
  id: UUIDString;
}

export interface GetTaskData {
  task?: {
    title: string;
    status: string;
  };
}

export interface GetTaskVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    email: string;
    displayName: string;
  };
}

export interface LinkTaskTagData {
  taskTag_insert: TaskTag_Key;
}

export interface LinkTaskTagVariables {
  taskId: UUIDString;
  tagId: UUIDString;
}

export interface ListCommentsData {
  comments: ({
    content: string;
    author?: {
      displayName: string;
    };
  })[];
}

export interface ListCommentsVariables {
  taskId: UUIDString;
}

export interface ListProjectsData {
  projects: ({
    id: UUIDString;
    title: string;
  } & Project_Key)[];
}

export interface ListTagsData {
  tags: ({
    name: string;
  })[];
}

export interface ListTaskTagsData {
  taskTags: ({
    tag: {
      name: string;
    };
  })[];
}

export interface ListTaskTagsVariables {
  taskId: UUIDString;
}

export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
  } & Task_Key)[];
}

export interface ListUsersData {
  users: ({
    id: UUIDString;
    displayName: string;
  } & User_Key)[];
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface RemoveTaskTagData {
  taskTag_delete?: TaskTag_Key | null;
}

export interface RemoveTaskTagVariables {
  taskId: UUIDString;
  tagId: UUIDString;
}

export interface Tag_Key {
  id: UUIDString;
  __typename?: 'Tag_Key';
}

export interface TaskTag_Key {
  taskId: UUIDString;
  tagId: UUIDString;
  __typename?: 'TaskTag_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateCommentData {
  comment_update?: Comment_Key | null;
}

export interface UpdateCommentVariables {
  id: UUIDString;
  content: string;
}

export interface UpdateProjectData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectVariables {
  id: UUIDString;
  title: string;
}

export interface UpdateTagData {
  tag_update?: Tag_Key | null;
}

export interface UpdateTagVariables {
  id: UUIDString;
  color: string;
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUser(options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to execute without passing in DataConnect. */
export function getUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetUser' Query. Allow users to pass in custom DataConnect instances. */
export function getUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to execute without passing in DataConnect. */
export function listUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProject' Mutation. Allow users to execute without passing in DataConnect. */
export function createProject(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProjectData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProject(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProjectData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProject' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProject(dc: DataConnect, vars: UpdateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProjectData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProject(vars: UpdateProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProjectData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProject' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProject(dc: DataConnect, vars: DeleteProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProjectData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProject' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProject(vars: DeleteProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProjectData>>;

/** Generated Node Admin SDK operation action function for the 'GetProject' Query. Allow users to execute without passing in DataConnect. */
export function getProject(dc: DataConnect, vars: GetProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectData>>;
/** Generated Node Admin SDK operation action function for the 'GetProject' Query. Allow users to pass in custom DataConnect instances. */
export function getProject(vars: GetProjectVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProjectData>>;

/** Generated Node Admin SDK operation action function for the 'ListProjects' Query. Allow users to execute without passing in DataConnect. */
export function listProjects(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectsData>>;
/** Generated Node Admin SDK operation action function for the 'ListProjects' Query. Allow users to pass in custom DataConnect instances. */
export function listProjects(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProjectsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to execute without passing in DataConnect. */
export function createTask(dc: DataConnect, vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;
/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function createTask(vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateTask' Mutation. Allow users to execute without passing in DataConnect. */
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateTask(vars: UpdateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteTask' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTaskData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteTask(vars: DeleteTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTaskData>>;

/** Generated Node Admin SDK operation action function for the 'GetTask' Query. Allow users to execute without passing in DataConnect. */
export function getTask(dc: DataConnect, vars: GetTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskData>>;
/** Generated Node Admin SDK operation action function for the 'GetTask' Query. Allow users to pass in custom DataConnect instances. */
export function getTask(vars: GetTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskData>>;

/** Generated Node Admin SDK operation action function for the 'ListTasks' Query. Allow users to execute without passing in DataConnect. */
export function listTasks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTasksData>>;
/** Generated Node Admin SDK operation action function for the 'ListTasks' Query. Allow users to pass in custom DataConnect instances. */
export function listTasks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListTasksData>>;

/** Generated Node Admin SDK operation action function for the 'CreateComment' Mutation. Allow users to execute without passing in DataConnect. */
export function createComment(dc: DataConnect, vars: CreateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCommentData>>;
/** Generated Node Admin SDK operation action function for the 'CreateComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function createComment(vars: CreateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCommentData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateComment' Mutation. Allow users to execute without passing in DataConnect. */
export function updateComment(dc: DataConnect, vars: UpdateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCommentData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateComment(vars: UpdateCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCommentData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteComment' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteComment(dc: DataConnect, vars: DeleteCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCommentData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteComment' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteComment(vars: DeleteCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCommentData>>;

/** Generated Node Admin SDK operation action function for the 'GetComment' Query. Allow users to execute without passing in DataConnect. */
export function getComment(dc: DataConnect, vars: GetCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCommentData>>;
/** Generated Node Admin SDK operation action function for the 'GetComment' Query. Allow users to pass in custom DataConnect instances. */
export function getComment(vars: GetCommentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCommentData>>;

/** Generated Node Admin SDK operation action function for the 'ListComments' Query. Allow users to execute without passing in DataConnect. */
export function listComments(dc: DataConnect, vars: ListCommentsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCommentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListComments' Query. Allow users to pass in custom DataConnect instances. */
export function listComments(vars: ListCommentsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCommentsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateTag' Mutation. Allow users to execute without passing in DataConnect. */
export function createTag(dc: DataConnect, vars: CreateTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTagData>>;
/** Generated Node Admin SDK operation action function for the 'CreateTag' Mutation. Allow users to pass in custom DataConnect instances. */
export function createTag(vars: CreateTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTagData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateTag' Mutation. Allow users to execute without passing in DataConnect. */
export function updateTag(dc: DataConnect, vars: UpdateTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTagData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateTag' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateTag(vars: UpdateTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTagData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteTag' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteTag(dc: DataConnect, vars: DeleteTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTagData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteTag' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteTag(vars: DeleteTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTagData>>;

/** Generated Node Admin SDK operation action function for the 'GetTag' Query. Allow users to execute without passing in DataConnect. */
export function getTag(dc: DataConnect, vars: GetTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTagData>>;
/** Generated Node Admin SDK operation action function for the 'GetTag' Query. Allow users to pass in custom DataConnect instances. */
export function getTag(vars: GetTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTagData>>;

/** Generated Node Admin SDK operation action function for the 'ListTags' Query. Allow users to execute without passing in DataConnect. */
export function listTags(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTagsData>>;
/** Generated Node Admin SDK operation action function for the 'ListTags' Query. Allow users to pass in custom DataConnect instances. */
export function listTags(options?: OperationOptions): Promise<ExecuteOperationResponse<ListTagsData>>;

/** Generated Node Admin SDK operation action function for the 'LinkTaskTag' Mutation. Allow users to execute without passing in DataConnect. */
export function linkTaskTag(dc: DataConnect, vars: LinkTaskTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<LinkTaskTagData>>;
/** Generated Node Admin SDK operation action function for the 'LinkTaskTag' Mutation. Allow users to pass in custom DataConnect instances. */
export function linkTaskTag(vars: LinkTaskTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<LinkTaskTagData>>;

/** Generated Node Admin SDK operation action function for the 'RemoveTaskTag' Mutation. Allow users to execute without passing in DataConnect. */
export function removeTaskTag(dc: DataConnect, vars: RemoveTaskTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemoveTaskTagData>>;
/** Generated Node Admin SDK operation action function for the 'RemoveTaskTag' Mutation. Allow users to pass in custom DataConnect instances. */
export function removeTaskTag(vars: RemoveTaskTagVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemoveTaskTagData>>;

/** Generated Node Admin SDK operation action function for the 'ListTaskTags' Query. Allow users to execute without passing in DataConnect. */
export function listTaskTags(dc: DataConnect, vars: ListTaskTagsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTaskTagsData>>;
/** Generated Node Admin SDK operation action function for the 'ListTaskTags' Query. Allow users to pass in custom DataConnect instances. */
export function listTaskTags(vars: ListTaskTagsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTaskTagsData>>;

