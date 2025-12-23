import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/Button";
import { getConversations, newConversation, newMessage, testSocket } from "@/socket/socketEvents";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import ConversationItem from "@/components/ConversationItem";
import Loading from "@/components/Loading";
import { ConversationProps, ResponseProps } from "@/types";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(0);

  const[loading, setLoading] = useState(false);

  const [conversations, setConversations] = useState<ConversationProps[]>([])

  useEffect( () => {
    getConversations(processConversations);
    newConversation(newConversationHandler);
    newMessage(newMessageHandler);

  
    getConversations(null);

    return () => {
      getConversations(processConversations, true);
      newConversation(newConversationHandler, true);
      newMessage(newMessageHandler, true);
    }
  }, []);

  const newMessageHandler = (res: ResponseProps) => {
    if(res.success){
      let conversationId = res.data.conversationId;
      setConversations((prev)=>{
        let updatedConversations = prev.map((item) => {
          if(item._id == conversationId) item.lastMessage = res.data;
          return item;
        })

        return updatedConversations;
      })
    }
  }

  const processConversations = (res: ResponseProps) => {
    // console.log('res', res);
    if(res.success){
      setConversations(res.data);
    }
  }

  const newConversationHandler = (res: ResponseProps) => {
    if(res.success && res.data?.isNew){
      setConversations((prev) => [...prev, res.data]);
    }
  }

  // console.log("user: ", user);

  // useEffect(() => {
  //   testSocket(testSocketCallbackHandler);
  //   testSocket(null);

  //   return ()=>{
  //     testSocket(testSocketCallbackHandler, true);
  //   }
  // }, []);

  // const testSocketCallbackHandler = (data:any) => {
  //   console.log('got response from testSocket event: ', data)
  // }

  const handleLogout = async () => {
    await signOut();
  };

  // const conversations = [ 
  //   {
  //     name: "Charlie",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Charlie",
  //       content: "Thanks!",
  //       createdAt: "2025-06-23T11:15:00Z",
  //     },
  //   },
  //   {
  //     name: "Alex",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "You",
  //       content: "Are we still meeting today?",
  //       createdAt: "2025-06-23T10:42:18Z",
  //     },
  //   },
  //   {
  //     name: "Design Team",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Maya",
  //       content: "I pushed the updated UI mockups.",
  //       createdAt: "2025-06-23T09:58:47Z",
  //     },
  //   },
  //   {
  //     name: "Support",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Rahul",
  //       content: "The server restart is complete.",
  //       createdAt: "2025-06-22T21:30:05Z",
  //     },
  //   },
  //   {
  //     name: "Charlie",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "You",
  //       content: "Talk later 👍",
  //       createdAt: "2025-06-22T19:12:33Z",
  //     },
  //   },
  //   {
  //     name: "Product Sync",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Ananya",
  //       content: "Let's finalize the roadmap tomorrow.",
  //       createdAt: "2025-06-22T16:45:10Z",
  //     },
  //   },
  //   {
  //     name: "Mom",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Mom",
  //       content: "Reached home safely?",
  //       createdAt: "2025-06-22T15:20:54Z",
  //     },
  //   },
  //   {
  //     name: "Gym Buddies",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "Karan",
  //       content: "Leg day tomorrow at 6 AM.",
  //       createdAt: "2025-06-22T14:05:31Z",
  //     },
  //   },
  //   {
  //     name: "Dev Chat",
  //     type: "group",
  //     lastMessage: {
  //       senderName: "You",
  //       content: "I’ll fix the Android modal animation today.",
  //       createdAt: "2025-06-22T12:48:00Z",
  //     },
  //   },
  //   {
  //     name: "Priya",
  //     type: "direct",
  //     lastMessage: {
  //       senderName: "Priya",
  //       content: "Send me the notes when you're free.",
  //       createdAt: "2025-06-21T22:10:42Z",
  //     },
  //   },
  // ];

  let directConversations = conversations
    .filter((item: ConversationProps) => item.type == "direct")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;

      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  let groupConversations = conversations
    .filter((item: ConversationProps) => item.type == "group")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;

      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo
              color={colors.neutral200}
              size={19}
              textProps={{ numberOfLines: 1 }}
            >
              Welcome back,{" "}
              <Typo size={20} color={colors.white} fontWeight={"800"}>
                {currentUser?.name}
              </Typo>{" "}
              🌱
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => {
              router.push("/(main)/profileModal");
            }}
          >
            <Icons.GearSix
              color={colors.white}
              weight="fill"
              size={verticalScale(22)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  onPress={() => setSelectedTab(0)}
                  style={[
                    styles.tabStyle,
                    selectedTab == 0 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Direct Messages</Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  style={[
                    styles.tabStyle,
                    selectedTab == 1 && styles.activeTabStyle,
                  ]}
                >
                  <Typo>Groups</Typo>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.conversationList}>
              {selectedTab == 0 &&
                directConversations.map((item: ConversationProps, index) => {
                  return (
                    <ConversationItem
                      item={item}
                      key={index}
                      router={router}
                      showDivider={directConversations.length != index + 1}
                    />
                  );
                })}

                {selectedTab == 1 &&
                groupConversations.map((item: ConversationProps, index) => {
                  return (
                    <ConversationItem
                      item={item}
                      key={index}
                      router={router}
                      showDivider={directConversations.length != index + 1}
                    />
                  );
                })}
            </View>
            {
              !loading && selectedTab == 0 && directConversations.length==0 &&(
                <Typo style = {{textAlign: 'center'}}>
                  You don't have any messages
                </Typo>
              )
            }

            {
              !loading && selectedTab == 1 && groupConversations.length==0 &&(
                <Typo style = {{textAlign: 'center'}}>
                  You haven't joined any groups yet
                </Typo>
              )
            }

            {
              loading && <Loading />
            }
          </ScrollView>
        </View>
      </View>
      <Button style = {styles.floatingButton} onPress={() => router.push({
        pathname: "/(main)/newConversationModal",
        params: {isGroup: selectedTab}
      })}>
        <Icons.Plus color = {colors.black} weight = "bold" size = {verticalScale(24)} />
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._20,
  },
  navBar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});
