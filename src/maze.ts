
class Maze {

  gridSize: number;
  wallDirectionType: string;
  arrayType: string;
  arrayOrder: string;
  data: number[] = [];

  NORTH = 0b0001;
  EAST = 0b0010;
  WEST = 0b0100;
  SOUTH = 0b1000;


  constructor(gridSize: number, wallDirectionType: string, arrayType: string, arrayOrder: string) {
    this.gridSize = gridSize;
    this.wallDirectionType = wallDirectionType;
    this.arrayType = arrayType;
    this.arrayOrder = arrayOrder;

    if (wallDirectionType === "N-E-W-S") {
      this.NORTH = 0b0001;
      this.EAST = 0b0010;
      this.WEST = 0b0100;
      this.SOUTH = 0b1000;
    } else if (wallDirectionType === "N-E-S-W") {
      this.NORTH = 0b0001;
      this.EAST = 0b0010;
      this.SOUTH = 0b0100;
      this.WEST = 0b1000;
    }

  }

  get_text() {
    return this.data.map((ele) => { return ele & 0x0f }).reduce((acc, curr, index) => {
      // 32個ごとに改行を挿入
      if (index > 0 && index % this.gridSize === 0) {
        acc += ",\n";
      }
      return acc + (index % this.gridSize === 0 ? "" : ",") + curr;
    }, "");
  }

  get_data(idx: number) {
    return this.data[idx];
  }

  set_from_text(text: string) {
    this.data = text.split(",").map(Number);
  }

  set_data(maze_data: number[]) {

  }

  get_x(idx: number) {
    return this.arrayOrder === "a->b" ? idx % this.gridSize : Math.floor(idx / this.gridSize);
  }

  get_y(idx: number) {
    return this.arrayOrder === "a->b" ? Math.floor(idx / this.gridSize) : idx % this.gridSize;
  }

  update(idx: number, wall: string) {
    const x = this.get_x(idx);
    const y = this.get_y(idx);
    if (wall == "north") {
      // const exist = (this.data[idx] & this.NORTH) === this.NORTH;
      this.data[idx] = (this.data[idx] ^ this.NORTH) & 0x0f;
      if (y < this.gridSize - 1) {
        this.data[idx + 1] = (this.data[idx + 1] ^ this.SOUTH) & 0x0f;
      }
    } else if (wall == "east") {
      this.data[idx] = (this.data[idx] ^ this.EAST) & 0x0f;
      if (x < this.gridSize - 1) {
        this.data[idx + this.gridSize] = (this.data[idx + this.gridSize] ^ this.WEST) & 0x0f;
      }
    } else if (wall == "west") {
      this.data[idx] = (this.data[idx] ^ this.WEST) & 0x0f;
      if (x > 0) {
        this.data[idx - this.gridSize] = (this.data[idx - this.gridSize] ^ this.EAST) & 0x0f;
      }
    } else if (wall == "south") {
      this.data[idx] = (this.data[idx] ^ this.SOUTH) & 0x0f;
      if (y > 0) {
        this.data[idx - 1] = (this.data[idx - 1] ^ this.NORTH) & 0x0f;
      }
    }
  }
}

export default Maze;