<template>
  <div class="app-container">
    <DxGantt
      :ref="ganttRef"
      :task-list-width="500"
      :height="700"
      scale-type="weeks"
      @task-inserting="onTaskInserting"
      @task-inserted="onTaskInserted"
      @task-dbl-click="onTaskDblClick"
      @task-updated="onTaskUpdated"
      @task-deleted="onTaskDeleted"
      @task-moving="onTaskMoving"
      @resource-assigned="onResourceAssigned"
      @resource-unassigned="onResourceUnassigned"
      @dependency-inserted="onDependencyInserted"
      @dependency-deleted="onDependencyDeleted"
    >
      <DxTasks :data-source="tasks" />
      <DxDependencies :data-source="dependencies" />
      <DxResources :data-source="workers" />
      <DxResourceAssignments :data-source="resourceAssignments" />

      <DxToolbar>
        <DxItem name="undo" />
        <DxItem name="redo" />
        <DxItem name="separator" />
        <DxItem name="collapseAll" />
        <DxItem name="expandAll" />
        <DxItem name="separator" />
        <DxItem name="addTask" />
        <DxItem name="deleteTask" />
        <DxItem name="separator" />
        <DxItem name="zoomIn" />
        <DxItem name="zoomOut" />
      </DxToolbar>

      <DxEditing
        :enabled="true"
        :allow-resource-adding="false"
        :allow-resource-deleting="false"
      />
      <DxValidation :auto-update-parent-tasks="true" />

      <DxColumn
        :width="130"
        data-field="title"
        caption="工作項目"
      />
      <DxColumn
        caption="進度回報"
        cell-template="processReportTemplate"
        width="90px"
      />
      <DxColumn
        caption="數量"
        cell-template="countTemplate"
        width="50px"
      />
      <DxColumn
        data-field="progress"
        :format="customPercentageFormatter"
        caption="進度"
        width="50px"
      />
      <DxColumn
        data-field="start"
        :format="customDateFormatter"
        caption="開始"
        width="90px"
      />
      <DxColumn
        data-field="end"
        :format="customDateFormatter"
        caption="結束"
        width="90px"
      />
      <template #processReportTemplate="{ data: options }">
        <el-button @click="openDialog(options.data)">回報</el-button>
      </template>

      <template #countTemplate="{ data: options }">
        {{ options.data.count }}
      </template>
    </DxGantt>

    <!-- 表單 -->
    <el-dialog title="回報數量" :visible.sync="formShow">
      <el-form
        :model="countForm"
      >
        <el-form-item label="數量" prop="count">
          <el-input v-model="countForm.count" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm()">
          送出
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import 'devexpress-gantt/dist/dx-gantt.css'
import {
  getTaskList,
  getTask,
  updateTask,
  deleteTask,
  getWorkerList,
  getResourceAssignmentList,
  updateResourceAssignment,
  deleteResourceAssignment,
  getDependencies,
  createDependency,
  deleteDependency
} from '@/api/task'

import {
  DxGantt,
  DxTasks,
  DxDependencies,
  DxResources,
  DxResourceAssignments,
  DxColumn,
  DxEditing,
  DxValidation,
  DxToolbar,
  DxItem
} from 'devextreme-vue/gantt'

const ganttRef = 'gantt'

export default {
  components: {
    DxGantt,
    DxTasks,
    DxDependencies,
    DxResources,
    DxResourceAssignments,
    DxColumn,
    DxEditing,
    DxValidation,
    DxToolbar,
    DxItem
  },

  data() {
    return {

      ganttRef,

      /** 工作項目列表 */
      tasks: [],

      /** 工作相依關係 */
      dependencies: [],

      /** 指派對象 */
      workers: [],

      /** 工作已指派到對象 */
      resourceAssignments: [],

      /** 選取的工作項目 */
      selectedTask: null,

      /** 顯示或隱藏表單對話框 */
      formShow: false,

      /** 回報數量表單 */
      countForm: {}
    }
  },

  computed: {
    gantt: function() {
      return this.$refs[ganttRef].instance
    }
  },

  created() {
    this.taskList()
    this.workerList()
    this.resourceAssignmentList()
    this.dependencyList()
  },

  methods: {

    /**
     * 日期格式
     * @param {*} date
     */
    customDateFormatter(date) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}-${month}-${day}`
    },

    /**
     * 進度百分比格式
     * @param {*} value
     */
    customPercentageFormatter(value) {
      return `${value}%`
    },

    /**
     * 工作列表
     */
    taskList() {
      getTaskList().then(response => {
        this.tasks = response.data
      })
    },

    /**
     * 工作人員列表
     */
    workerList() {
      getWorkerList().then(response => {
        this.workers = response.data
      })
    },

    /**
     * 取得指派工作列表
     */
    resourceAssignmentList() {
      getResourceAssignmentList().then(response => {
        this.resourceAssignments = response.data
      })
    },

    /**
     * 取得工作相依(延伸)關係列表
     */
    dependencyList() {
      getDependencies().then(response => {
        this.dependencies = response.data
      })
    },

    /**
     * 插進工作
     * @param {*} e
     */
    onTaskInserted(e) {
      console.log('插進工作', e)

      if (e.values.text === ' ') {
        console.log('沒標題')
      } else {
        const data = e.values

        console.log('data.parentId', data.parentId)
        if (data.parentId === undefined) {
          data.parentId = 0
        }

        const payload = {
          id: 0,
          parentId: parseFloat(data.parentId),
          title: data.title,
          start: data.start,
          end: data.end,
          progress: data.progress,
          count: 0
        }

        console.log('插進工作 payload', payload)

        updateTask(payload)
          .then(response => {
            console.log('InsertTask result', response)
            this.taskList()
          })
      }
    },

    onTaskInserting(e) {
      console.log('新增工作中', e)
    },

    /**
     * 選取工作
     * @param {*} e
     */
    onTaskDblClick(e) {
      if (e.key !== 0) {
        console.log('選取工作：', e)
        this.selectedTask = e.data
        this.selectedTask.parentId = parseInt(e.data.parentId)
      }
    },

    /**
     * 更新工作
     * @param {*} e
     */
    onTaskUpdated(e) {
      console.log('更新工作：', e)

      var id = e.key
      const findIdParam = {
        Id: id
      }
      getTask(findIdParam).then(response => {
        this.selectedTask = response.data
        console.log('payload：', this.selectedTask)

        console.log('e.values.parentId', e.values.parentId)
        if (e.values.parentId !== undefined) {
          this.selectedTask.parentId = e.values.parentId
        }

        if (e.values.title !== undefined) {
          this.selectedTask.title = e.values.title
        }

        if (e.values.start !== undefined) {
          this.selectedTask.start = e.values.start
        }

        if (e.values.end !== undefined) {
          this.selectedTask.end = e.values.end
        }

        if (e.values.progress !== undefined) {
          this.selectedTask.progress = parseInt(e.values.progress)
          console.log('progress', this.selectedTask.progress)
        }

        updateTask(this.selectedTask)
          .then(response => {
            console.log('updateTask result', response)
            this.taskList()
          })
      })
    },

    /**
     * 刪除工作
     * @param {*} e
     */
    onTaskDeleted(e) {
      console.log('刪除工作', e)
      const payload = {
        id: e.values.id
      }

      deleteTask(payload)
        .then(response => {
          console.log('deleteTask result', response)
        })
    },

    /**
     * 移動工作
     * @param {*} e
     */
    onTaskMoving(e) {
      console.log('移動工作', e)
      if (e.key !== 0) {
        this.selectedTask = e.values
        this.selectedTask.parentId = parseFloat(e.values.parentId)
        this.selectedTask.start = e.newValues.start
        this.selectedTask.end = e.newValues.end
      }
    },

    /**
     * 分派工作
     * @param {*} e
     */
    onResourceAssigned(e) {
      console.log('分派工作', e)

      const payload = {
        taskId: e.values.taskId,
        resourceId: e.values.resourceId
      }

      updateResourceAssignment(payload)
        .then(response => {
          console.log('updateResourceAssignment result', response.data)
          this.commonSuccessMsgAndGetAssignContent(response)
        })
    },

    /**
     * 取消指派該工作給工作人員
     * @param {*} e
     */
    onResourceUnassigned(e) {
      console.log('取消指派該工作給工作人員', e)
      const payload = {
        id: e.values.id
      }
      deleteResourceAssignment(payload)
        .then(response => {
          this.commonSuccessMsgAndGetAssignContent(response)
        })
    },

    /**
     *共用成功訊息與重新擷取指派內容
     * @param {*} response
     */
    commonSuccessMsgAndGetAssignContent(response) {
      if (response.data.statusCode === 200) {
        this.$message({
          message: response.data.message,
          type: 'success'
        })
        this.resourceAssignmentList()
      }
    },

    /**
     * 建立工作延伸下一個工作的關係
     * @param {*} e
     */
    onDependencyInserted(e) {
      console.log('建立工作延伸下一個工作的關係', e)

      const payload = {
        predecessorId: e.values.predecessorId,
        successorId: e.values.successorId
      }

      createDependency(payload)
        .then(response => {
          console.log('createDependency result', response)
        })
    },

    /**
     * 刪除工作的相依延伸關係
     * @param {*} e
     */
    onDependencyDeleted(e) {
      console.log('刪除工作的相依延伸關係', e)

      const payload = {
        id: e.values.id,
        predecessorId: e.values.predecessorId,
        successorId: e.values.successorId
      }

      deleteDependency(payload)
        .then(response => {
          console.log('deleteDependency result', response)
        })
    },

    /**
     * 開啟對話框
     * @param {*} data
     */
    openDialog(data) {
      this.formShow = true

      const findIdParam = {
        Id: data.id
      }
      getTask(findIdParam).then(response => {
        this.countForm = response.data
      })
    },

    /**
     * 提交表單
     */
    submitForm() {
      // this.gantt.beginUpdate()

      const payload = this.countForm
      payload.count = parseInt(this.countForm.count)
      updateTask(payload)
        .then(response => {
          console.log('updateTask result', response)

          if (response.data.statusCode === 200) {
            // this.taskList()
            this.tasks.forEach(element => {
              if (element.id === payload.id) {
                element.count = payload.count
              }
            })
            this.formShow = false
            this.gantt.refresh()
          }
        })
      // this.gantt.getTaskData(this.countForm.id)
      // this.gantt.endUpdate()
    }
  }
}
</script>

<style>
  #gantt {
    height: 700px;
  }
</style>
