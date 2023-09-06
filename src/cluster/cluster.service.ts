import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClusterService {
  constructor(private prisma: PrismaService) {}

  findSimilarUsersByIndices(
    indices: number[],
    users: any[],
    currentUserIndex: number,
  ): any[] {
    const topUsers = [];
    for (const index of indices) {
      // the most top user is oneself. so removing this and adding others.:P
      if (!(index === currentUserIndex)) {
        if (index >= 0 && index < users.length) {
          topUsers.push(users[index].id);
        }
      }
    }
    return topUsers;
  }

  findTopIndices(arr: number[], topNumbers: number): number[] {
    // Create a copy of the array
    const copiedArray = [...arr];
    // console.log(copiedArray);
    // Sort the copied array in descending order
    copiedArray.sort((a, b) => b - a);
    // console.log(copiedArray);
    // Take the first `topNumxbers` elements (top N numbers)
    const topNNumbers = copiedArray.slice(0, topNumbers);
    // console.log(topNNumbers);
    // Find the indices of the top N numbers in the original array
    const indices: number[] = [];
    for (
      let i = 0;
      i < arr.length && indices.length < topNNumbers.length;
      i++
    ) {
      const num = arr[i];
      if (topNNumbers.includes(num)) {
        indices.push(i);
      }
    }
    console.log('indices : ' + indices);
    return indices;
  }

  cosineSimilarity(A: number[], B: number[]): number {
    // Initialize the sums
    let sumAiBi = 0,
      sumAiAi = 0,
      sumBiBi = 0;

    // Iterate over the elements of vectors A and B
    for (let i = 0; i < A.length; i++) {
      // Calculate the sum of Ai*Bi
      sumAiBi += A[i] * B[i];
      // Calculate the sum of Ai*Ai
      sumAiAi += A[i] * A[i];
      // Calculate the sum of Bi*Bi
      sumBiBi += B[i] * B[i];
    }

    const calc = sumAiBi / Math.sqrt(sumAiAi * sumBiBi);
    if (isNaN(calc)) {
      return 0;
    }
    // Calculate and return the cosine similarity return calc:
    return calc;
  }
  async addProfileViews(userId: number, vendorId: number) {
    await this.prisma.profileViews.upsert({
      where: { userId_vendorId: { userId, vendorId } },
      update: { count: { increment: 1 } },
      // TODO in case of create increament by 1 too.
      create: {
        userId,
        vendorId,
      },
    });
  }
  async getSimilarUsers() {
    // fetch all the users
    // fetch all the vendors with the per clicks
    // create a matrix
    const allUsers = await this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    const allVendors = await this.prisma.vendor.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    const watchedMatrix: number[][] = [];
    await Promise.all(
      allUsers.map(async (user) => {
        const specificUserViews: number[] = [];
        await Promise.all(
          allVendors.map(async (vendor) => {
            const watchesUserDoneForVendor =
              await this.prisma.profileViews.findUnique({
                where: {
                  userId_vendorId: {
                    userId: user.id,
                    vendorId: vendor.id,
                  },
                },
              });
            if (watchesUserDoneForVendor !== null) {
              specificUserViews.push(watchesUserDoneForVendor.count);
            } else {
              // to create same dimension of matrix
              specificUserViews.push(0);
            }
            // console.log('specific user views', specificUserViews)
          }),
        );
        watchedMatrix.push(specificUserViews);
      }),
    );
    const userSimilarities: number[][] = [];
    for (let i = 0; i < watchedMatrix.length; i++) {
      const similarities: number[] = [];
      for (let j = 0; j < watchedMatrix.length; j++) {
        console.log(
          `user ${i + 1} watched vendor ${j + 1} and watched times ${
            watchedMatrix[i]
          } ${watchedMatrix[j]} `,
        );
        similarities.push(
          this.cosineSimilarity(watchedMatrix[i], watchedMatrix[j]),
        );
        // console.log(`cosine similarity between ${user.userId}, ${vendor}`);
      }
      userSimilarities.push(similarities);
      // console.log(userSimilarities);
    }
    // console.log('user similarities' + userSimilarities);
    // now adding the similar users to the database
    for (let i = 0; i < allUsers.length; i++) {
      const userData = allUsers[i];
      const userSimilarityData = userSimilarities[i];
      // console.log(userSimilarityData);
      const topIndices = this.findTopIndices(userSimilarityData, 4);
      // now add the similar users in the database
      // console.log('top indices 138(' + i + '): ' + topIndices);
      const topUserIds = this.findSimilarUsersByIndices(
        topIndices,
        allUsers,
        i,
      );
      // console.log(topUserIds);
      await this.addSimilarUsers(userData.id, topUserIds);
      // console.log(topUserIds);
    }
  }
  async addSimilarUsers(userId: number, userIds: number[]) {
    await this.prisma.similarUser
      .delete({
        where: { mainUserId: userId },
      })
      .catch((e) => {}); // incase there is not data this will throw an error which is just neglected})
    await this.prisma.similarUser.create({
      data: {
        mainUserId: userId,
        similarUsers: {
          connect: userIds.map((userId) => {
            return { id: userId };
          }),
        },
      },
    });
  }
}
