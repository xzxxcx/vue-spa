<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    catelist: [],
    // 级联选择框的配置对象
    cateProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    // 级联选择框双向绑定到的数组
    selectedCateKeys: [],
    activeName: 'many',
    manyTableData: [],
    onlyTableData: [],
    addDialogVisible: false,
    editDialogVisible: false,
    addForm: {
      attr_name: ''
    },
    editForm: {},
    addFormRules: {
      attr_name: [
        { required: true, message: '请输入参数名称', trigger: 'blur' }
      ]
    }
  }),
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表

    async getCateList () {
      const {
        data: { data, meta }
      } = await this.$http.get('categories')

      if (meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      console.log(data)
      this.catelist = data
    },
    // 级联选择框选中项变化，会触发这个函数

    handleChange () {
      this.getParamsDate()
    },
    // 获取参数的列表数据
    async getParamsDate () {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏

        item.inputVisible = false
        // 文本框中输入的值

        item.inputValue = ''
      })
      console.log(data)

      if (this.activeName === 'only') {
        this.onlyTableData = data
      } else {
        this.manyTableData = data
      }
    },
    // tab 页签点击事件的处理函数

    handleTabClick () {
      console.log(this.activeName)
      this.getParamsDate()
    },
    // 点击按钮，添加参数

    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: { data, meta }
        } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.addDialogVisible = false
        this.getParamsDate()
        console.log(data)
      })
    },
    // 监听添加对话框的关闭事件

    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，展示修改的对话框

    async showEditDialog (id) {
      // 查询当前参数的信息

      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
      if (meta.status !== 200) {
        return this.$message.error('添加失败！')
      }
      this.editForm = data
      this.editDialogVisible = true
    },
    // 点击按钮，修改参数信息

    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: { data, meta }
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.$message.success('更新成功！')
        this.editDialogVisible = false
        this.getParamsDate()

        console.log(data)
      })
    },
    // 重置修改的表单

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async removeParams (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const {
        data: { meta }
      } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsDate()
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals (row) {
      const { data: { meta } } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') })
      if (meta.status !== 200) return this.$message.error('添加失败')
      this.$message.success('更新成功')
      row.inputVisible = false
      row.inputValue = ''
      console.log(row.inputValue)
    },
    showInput (row) {
      row.inputVisible = true
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码

      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
