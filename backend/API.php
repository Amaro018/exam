
<?php
require_once('MysqliDb.php');

header("Access-Control-Allow-Origin: *");

/**
 * Tells browsers whether to expose the response to the frontend JavaScript code
 * when the request's credentials mode (Request.credentials) is include
 */
header("Access-Control-Allow-Credentials: true");

/**
 * Specifies one or more methods allowed when accessing a resource in response to a preflight request
 */
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");

/**
 * Used in response to a preflight request which includes the Access-Control-Request-Headers to
 * indicate which HTTP headers can be used during the actual request
 */
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json");
class API {
    public function __construct()
    {
        $this->db = new MysqliDB('localhost', 'root', '', 'todolist');
    }


    public function httpGet($id = null)
    {
        $request_uri = $_SERVER['REQUEST_URI'];
        $ids = null;
        $exploded_request_uri = array_values(explode("/", $request_uri));
        $last_index = count($exploded_request_uri) - 1;


        $ids = $exploded_request_uri[$last_index];


        if (is_numeric($ids)) {
            // Fetch task with the specific id

            $this->db->where('id', $ids);
            $tasks = $this->db->getOne('tasks');

            $this->db->where('id', $tasks['id']);

            $tasks['task_items'] = $this->db->get('task_items');



            
            // Return all tasks as JSON
            echo json_encode($tasks);

            // Use `getOne` to fetch a single task
            
            // if ($task) {
            //     // Fetch task items for this task
            //     $this->db->where('id', $task['id']);
            //     $task['task_items'] = $this->db->get('task_items');
                
            //     // Return the single task as JSON
            //     echo json_encode($task);
            // } else {
            //     // Handle case where task with the specified ID is not found
            //     echo json_encode(['error' => 'Task not found']);
            // }
         
        } else 
        {
            // Fetch all tasks
            $tasks = $this->db->get('tasks');
                        
            // Fetch task items for each task
            foreach ($tasks as &$task) {
                $this->db->where('id', $task['id']);
                $task['task_items'] = $this->db->get('task_items');
            }
            
            // Return all tasks as JSON
            echo json_encode($tasks);
        }
         
    }
        
        
      public function httpPost($payload)
      {
        if (isset($payload['taskTitle']) && isset($payload['tasks'])) {
            $taskTitle = $payload['taskTitle'];
            $tasks = $payload['tasks'];
    
            // Insert the task title into the database
            $taskData = [
                'taskTitle' => $taskTitle
            ];
    
            $task_id = $this->db->insert('tasks', $taskData);
    
            // Insert each task (task name, time, and status)
            foreach ($tasks as $task) {
                $taskItem = [
                    'taskName' => $task['taskName'],
                    'taskTime' => $task['taskTime'],
                    'status' => $task['status'],
                    'id' => $task_id
                ];
                $this->db->insert('task_items', $taskItem);
            }
    
            echo json_encode(['message' => 'Task created successfully']);
        } else {
            echo json_encode(['error' => 'Invalid data']);
        }
      }


      public function httpPut($id,$payload) {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $status = $input['status'] ?? null;
        $taskName = $input['taskName'] ?? null;
        $task_items = $input['task_items'] ?? null;

        if ($task_items) {

            foreach ($task_items as $task) {
                $taskItem = [
                    'taskName' => $task['taskName'],
                    'taskTime' => $task['taskTime'],
                ];

                 $this->db->where('taskName', $task['taskItemId']);
                 $this->db->update('task_items', $taskItem);
            }
        
            echo json_encode(['status' => 'success']);
            return;
        }

        if ($id && $status &&  $taskName) {
            $this->db->where('taskName', $taskName)->update('task_items', $payload);
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid parameters']);
        }
    }


    
    
    
    
    public function httpDelete($id, $payload)
    {
        // First, check if the task with the given ID exists
        $this->db->where('id', $id);
        $task = $this->db->getOne('tasks');
        
        if ($task) {
            // Task exists, now delete associated task items
            $this->db->where('id', $id);
            $this->db->delete('task_items');
            
            // Now delete the task itself
            $this->db->where('id', $id);
            if ($this->db->delete('tasks')) {
                echo json_encode(['status' => 'success', 'message' => 'Task and its items deleted successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete task']);
            }
        } else {
            // Task does not exist
            echo json_encode(['status' => 'error', 'message' => 'Task not found']);
        }
    }
    


  }
  $request_method = $_SERVER['REQUEST_METHOD'];
  if ($request_method === 'GET') {
    $received_data = $_GET;
} else {
    //check if method is PUT or DELETE, and get the ids on URL
    if ($request_method === 'PUT' || $request_method === 'DELETE') {
        $request_uri = $_SERVER['REQUEST_URI'];


        $ids = null;
        $exploded_request_uri = array_values(explode("/", $request_uri));
        $last_index = count($exploded_request_uri) - 1;


        $ids = $exploded_request_uri[$last_index];


        }
    }


    //payload data
    $received_data = json_decode(file_get_contents('php://input'), true);

    $api = new API;

 //Checking if what type of request and designating to specific functions
  switch ($request_method) {
      case 'GET':
          $api->httpGet($received_data);
          break;
      case 'POST':
          $api->httpPost($received_data);
          break;
      case 'PUT':
          $api->httpPut($ids, $received_data);
          break;
      case 'DELETE':
          $api->httpDelete($ids, $received_data);
          break;
  }


?>