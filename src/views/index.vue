<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日付" style="width: 308px">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="開始日付"
            end-placeholder="終了日付"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">検索</el-button>
<!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="messageList">
      <el-table-column label="日時" align="center" prop="torokuNichiji" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.torokuNichiji, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作業者" align="center" prop="torokuShainBango"/>
      <el-table-column label="機能" align="center" prop="kinoMei"/>
      <el-table-column label="区分" align="center" prop="oshiraseKubun"/>
      <el-table-column label="お知らせ" align="center" prop="oshiraseMessage"/>
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

<script setup name="Top">
import {listMessage } from "@/api/system/top";
import {reactive, ref, toRefs} from "vue";
import {parseTime} from "@/utils/ruoyi";

// 获取当前组件实例
const {proxy} = getCurrentInstance();

const messageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    torokuNichiji: null
  },
  rules: {
    torokuNichiji: [
      {required: true, message: "日時不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);
const dateRange = ref([]);

/** 查询お知らせメッセージ列表 */
function getList() {
  loading.value = true;
  listMessage(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    messageList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  proxy.resetForm("queryForm");
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

getList();
</script>