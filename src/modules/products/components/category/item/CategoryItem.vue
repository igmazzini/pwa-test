<template>
  <div v-if="category" class="category-item">
    <div class="category-item--info">
      <p class="category-name">{{ category.category_name }}</p>
      <p>Grupo: {{ category.category_group?.group_name }}</p>
      <p>Codigo: {{ category.category_code }}</p>
     
    </div>
    <div class="category-item--action">
      <button @click="onEdit" class="category-item--action---button">
        <font-awesome-icon icon="fa-solid fa-pencil" />
      </button>
      <button @click="onDelete" class="category-item--action---button">
        <font-awesome-icon icon="fa-solid fa-ban" />
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: "CategoryItem",
  emits: ["on-edit", "on-delete"],
  props: {
    category: {
      type: Object,
      default: () => {
        return {
          category_name: "category name",
          category_code: "category code",
          category_group: {
            category_group_name: "Sarasa",
          },
          date_created: "00/00/00",
        };
      },
    },
  },
  setup(props, context) {
    const onEdit = () => {
      context.emit("on-edit", props.category.category_id);
    };
    const onDelete = () => {
      context.emit("on-delete", props.category.category_id);
    };

    return {
      onEdit,
      onDelete,
      
    };
  },
};
</script>

<style lang="scss" scoped>
.category-item {
  width: 95%;
  height: 120px;
  background-color: var(--light-background-color);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  display: grid;
  grid-template-columns: 1fr 10%;
  padding: 15px;
  margin-bottom: 20px;
  transition: all var(--animation-duration) var(--animation-type);
}

.category-item--info {
  display: grid;
  grid-template-rows: 1fr 15%;
  align-items: center;
  color: var(--light-text-color);
  transition: all var(--animation-duration) var(--animation-type);

  p {
    margin: 0;
    padding: 0;
    font-family: RobotoLight;
    color: var(--light-subtitle-color);
    font-size: 1em;
    transition: all var(--animation-duration) var(--animation-type);
    margin-bottom: 10px;
  }

  .category-name {
    font-size: 1.3em;
    margin-bottom: 0px;
    color: var(--light-text-color);
  }

  .category-amount {
    font-size: 2em;
  }

  .category-date {
    color: var(--ligth-subtitle-color);
    font-size: 0.9em;
  }
}

.category-item--action {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.category-item--action---button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: transparent;
  color: var(--light-text-color);
  font-size: 1.3em;
  transition: all var(--animation-duration) var(--animation-type);
}

.category-item--action---button:hover {
  background-color: var(--button-active-color-light);
}

.dark .category-item {
  background-color: var(--dark-background-color);
  border: 1px solid rgba(247, 243, 243, 0.2);
}

.dark .category-item--action---button {
  color: var(--dark-text-color);
}

.dark .category-item--info p {
  color: var(--dark-subtitle-color);
}
.dark .category-item--info .category-name {
  color: var(--dark-text-color);
}

.dark .category-item--action---button:hover {
  color: var(--light-text-color);
}
</style>