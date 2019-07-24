<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <table-tree
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        :show-row-hover="false"
        border
        index-text="#"
      >
        <template slot="isOk" slot-scope="scope">
          <!-- 是否有效 -->
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </table-tree>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 8, 10, 12, 15]"
        :page-size=" querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        ref="addCateFormRef"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="40%" @close="editCateDialogClosed">
      <el-form
        :model="editCateForm"
        ref="editCateFormRef"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    // 查询条件
    querInfo: {
      type: 3,
      pagenum: 1,
      pagesize: 5
    },
    // 商品分类的数据列表，默认为空
    catelist: [],
    // 总数据条数
    total: 0,
    columns: [
      {
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isOk'
      },
      {
        label: '排序',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'
      },
      {
        label: '操作',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'opt'
      }
    ],
    addCateDialogVisible: false,
    editCateDialogVisible: false,
    // 添加分类的表单数据对象
    addCateForm: {
      // 将要添加的分类的名称
      cat_name: '',
      // 父级分类的Id
      cat_pid: 0,
      // 分类的等级，默认要添加的是1级分类
      cat_level: 0
    },
    editCateForm: {
      // 将要添加的分类的名称
      cat_name: '',
      // 父级分类的Id
      cat_pid: 0,
      // 分类的等级，默认要添加的是1级分类
      cat_level: 0
    },
    addCateFormRules: {
      cat_name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    },
    // 父级分类的列表
    parentCateList: [],
    // 指定级联选择器的配置对象
    cascaderProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    // 选中的父级分类的Id数组
    selectedKeys: []

  }),
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const {
        data: { data, meta }
      } = await this.$http.get('categories', {
        params: this.querInfo
      })

      if (meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      console.log(data)
      // 把数据列表，赋值给 catelist
      this.catelist = data.result
      // 为总数据条数赋值
      this.total = data.total
    },
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const {
        data: { data, meta }
      } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      // console.log(data)
      this.parentCateList = data
    },
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: { data, meta } } = await this.$http.post('categories', this.addCateForm)

        if (meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        console.log(data)
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async showEditCateDialog (id) {
      const { data: { data, meta } } = await this.$http.get('categories/' + id)

      if (meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }

      this.$message.success('获取分类成功！')
      this.getParentCateList()
      console.log(data)
      this.editCateForm = data
      this.selectedKeys = [data.cat_id, data.cat_pid]
      // console.log(this.selectedKeys)
      this.editCateDialogVisible = true
    },
    editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: { data, meta } } = await this.$http.put('categories/' + this.editCateForm.cat_id, { cat_name: this.editCateForm.cat_name })

        if (meta.status !== 200) {
          return this.$message.error('编辑分类失败！')
        }

        this.$message.success('编辑分类成功！')
        console.log(data)
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    async removeCate (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: { meta } } = await this.$http.delete(`categories/${id}`)
      if (meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getCateList()
    },
    editCateDialogClosed () {
      this.$refs.editCateFormRef.resetFields()
      this.selectedKeys = []
      this.editCateForm.cat_level = 0
      this.editCateForm.cat_pid = 0
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
