<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日付" style="width: 308px">
        <el-date-picker
            v-model="queryParams.torokuNichiji"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column label="日時" align="center" prop="torokuNichiji" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.torokuNichiji, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作業者" align="center" prop="torokuShainBango" />
      <el-table-column label="機能" align="center" prop="kinoMei" />
      <el-table-column label="区分" align="center" prop="oshiraseKubun" />
      <el-table-column label="お知らせ" align="center" prop="oshiraseMessage" />
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改お知らせメッセージ对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMessage, getMessage, delMessage, addMessage, updateMessage } from "@/api/system/message";
import {ref} from "vue";
import {parseTime} from "../utils/ruoyi";

const torokuNichijiDate = ref('');

export default {
  name: "Message",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // お知らせメッセージ表格数据
      messageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        torokuNichiji: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        kinoMei: [
          { required: true, message: "機能不能为空", trigger: "blur" }
        ],
        oshiraseKubun: [
          { required: true, message: "区分不能为空", trigger: "blur" }
        ],
        oshiraseMessage: [
          { required: true, message: "お知らせ不能为空", trigger: "blur" }
        ],
        torokuShainBango: [
          { required: true, message: "作業者不能为空", trigger: "blur" }
        ],
        torokuNichiji: [
          { required: true, message: "日時不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    /** 查询お知らせメッセージ列表 */
    getList() {
      this.loading = true;
      listMessage(this.queryParams).then(response => {
        this.messageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        oshiraseNo: null,
        kinoMei: null,
        oshiraseKubun: null,
        oshiraseMessage: null,
        torokuShainBango: null,
        torokuNichiji: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      dateRange.value = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.oshiraseNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加お知らせメッセージ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const oshiraseNo = row.oshiraseNo || this.ids
      getMessage(oshiraseNo).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改お知らせメッセージ";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.oshiraseNo != null) {
            updateMessage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMessage(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const oshiraseNos = row.oshiraseNo || this.ids;
      this.$modal.confirm('是否确认删除お知らせメッセージ编号为"' + oshiraseNos + '"的数据项？').then(function() {
        return delMessage(oshiraseNos);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/message/export', {
        ...this.queryParams
      }, `message_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>